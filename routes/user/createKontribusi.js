const express = require('express');
const router = express.Router();
const Kontribusi = require('../../models/Kontribusi');
const KontribusiUang = require('../../models/KontribusiUang');
const KontribusiBarang = require('../../models/KontribusiBarang');
const KategoriKontribusi = require('../../models/KategoriKontribusi');

const auth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

router.get('/:id/create_kontribusi', auth, async (req, res) => {
    try {
        const kategoriKontribusi = await KategoriKontribusi.getAllByAcaraId(req.params.id);
        res.render('user/create_kategori_kontribusi', { id_acara: req.params.id, kategoriKontribusi });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat form kontribusi.');
        res.redirect(`/users/acara/${req.params.id}`);
    }
});

router.post('/:id/select_kategori', auth, (req, res) => {
    const { id_kategori } = req.body;
    res.redirect(`/user/acara/${req.params.id}/create_kontribusi_form?id_kategori=${id_kategori}`);
});

router.get('/:id/create_kontribusi_form', auth, async (req, res) => {
    try {
        const { id_kategori } = req.query;
        res.render('user/create_kontribusi', { id_acara: req.params.id, id_kategori });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat form kontribusi.');
        res.redirect(`/users/acara/${req.params.id}`);
    }
});

router.post('/:id/create_kontribusi', auth, async (req, res) => {
    try {
        const { jumlah_uang, jumlah_barang, id_kategori } = req.body;
        const id_acara = req.params.id;

        const kontribusi = await Kontribusi.store({
            id_acara,
            id_penyumbang: req.session.userId,
            status_validasi: 'belum divalidasi'
        });

        if (jumlah_uang) {
            await KontribusiUang.store({ id_kontribusi: kontribusi.insertId, jumlah_uang });
        } else if (jumlah_barang) {
            await KontribusiBarang.store({ id_kontribusi: kontribusi.insertId, jumlah_barang });
        }

        req.flash('success', 'Kontribusi berhasil ditambahkan.');
        res.redirect(`/users/acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Gagal menambahkan kontribusi. Silakan coba lagi.');
        res.redirect(`/users/acara/${req.params.id}/create_kontribusi`);
    }
});

module.exports = router;
