const express = require('express');
const router = express.Router();
const Acara = require('../../models/Acara');
const Kontribusi = require('../../models/Kontribusi');
const KontribusiUang = require('../../models/KontribusiUang');
const KontribusiBarang = require('../../models/KontribusiBarang');
const moment = require('moment');

// Middleware for authentication
const auth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

// GET detail acara
router.get('/:id', auth, async (req, res) => {
    try {
        const acara = await Acara.findById(req.params.id);
        const kontribusiUang = await KontribusiUang.getAllByAcaraId(req.params.id);
        const kontribusiBarang = await KontribusiBarang.getAllByAcaraId(req.params.id);

        const isEditable = moment().isBefore(moment(acara.waktu_acara).add(7, 'days'));

        res.render('user/detail_acara', { acara, kontribusiUang, kontribusiBarang, isEditable });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat data acara.');
        res.redirect('/user/acara');
    }
});

// POST untuk menghapus kontribusi
router.post('/:id/delete_kontribusi/:id_kontribusi', auth, async (req, res) => {
    try {
        const id_kontribusi = req.params.id_kontribusi;
        const id_acara = req.params.id;

        await Kontribusi.delete(id_kontribusi);
        req.flash('success', 'Kontribusi berhasil dihapus.');
        res.redirect(`/user/acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Gagal menghapus kontribusi. Silakan coba lagi.');
        res.redirect(`/user/acara/${id_acara}`);
    }
});

module.exports = router;
