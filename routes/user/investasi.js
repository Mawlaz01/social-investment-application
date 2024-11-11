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

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.session.userId;

        const kontribusiList = await Kontribusi.getAllByUserId(userId);
        const acaraIds = [...new Set(kontribusiList.map(k => k.id_acara))];

        const acaraList = await Promise.all(acaraIds.map(id => Acara.getById(id)));

        res.render('user/investasi', {
            acaraList: acaraList
        });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat mengambil daftar investasi');
        res.redirect('/users/dashboard');
    }
});

router.get('/detail_investasi/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id; 
        let kontribusi = await Kontribusi.getAllByUserIdAndAcaraId(req.session.userId, acaraId);
        let acara = await Acara.getById(acaraId);
        res.render('user/detail_investasi', { kontribusi, acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat detail investasi');
        res.redirect('/users/investasi');
    }
});

module.exports = router;
