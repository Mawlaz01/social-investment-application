const express = require('express');
const router = express.Router();
const Kontribusi = require('../../models/Kontribusi');
const KontribusiBarang = require('../../models/KontribusiBarang');

const auth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

router.get('/:id/create_kontribusi_barang', auth, (req, res) => {
    res.render('user/create_kontribusi_barang', { id_acara: req.params.id });
});

router.post('/:id/create_kontribusi_barang', auth, async (req, res) => {
    try {
        const { id_penyumbang, jumlah_barang } = req.body;
        const id_acara = req.params.id;

        const kontribusi = await Kontribusi.store({
            id_acara,
            id_penyumbang,
            status_validasi: 'belum divalidasi'
        });

        await KontribusiBarang.store({ id_kontribusi: kontribusi.insertId, jumlah_barang });

        req.flash('success', 'Kontribusi barang berhasil ditambahkan.');
        res.redirect(`/user/acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Gagal menambahkan kontribusi. Silakan coba lagi.');
        res.redirect(`/user/acara/${req.params.id}/create_kontribusi_barang`);
    }
});

module.exports = router;
