const express = require('express');
const router = express.Router();
const Kontribusi = require('../../models/Kontribusi');
const Acara = require('../../models/Acara');
const User = require('../../models/User');

const auth = async (req, res, next) => {
    if (req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) return next();
    }
    res.redirect('/login');
};

router.get('/:id', auth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const acaraId = req.params.id;

        const kontribusiUang = await Kontribusi.getAllUangByUserIdAndAcaraId(userId, acaraId);
        const kontribusiBarang = await Kontribusi.getAllBarangByUserIdAndAcaraId(userId, acaraId);

        const acara = await Acara.getById(acaraId);

        res.render('user/detail_investasi', {
            acara,
            kontribusiUang,
            kontribusiBarang
        });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat detail investasi');
        res.redirect('/users/investasi');
    }
});

router.post('/validate', auth, async (req, res) => {
    try {
        const { id_kontribusi, acaraId } = req.body;
        await Kontribusi.update(id_kontribusi, { status_validasi: 'valid' });
        res.redirect(`/users/detail_investasi/${acaraId}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memvalidasi kontribusi');
        res.redirect(`/users/detail_investasi/${req.body.acaraId}`);
    }
});

router.post('/lapor', auth, async (req, res) => {
    try {
        const { id_kontribusi, acaraId, laporan } = req.body;
        await Kontribusi.update(id_kontribusi, { status_validasi: 'tidak valid' });
        res.redirect(`/users/detail_investasi/${acaraId}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat melaporkan kontribusi');
        res.redirect(`/users/detail_investasi/${req.body.acaraId}`);
    }
});

module.exports = router;
