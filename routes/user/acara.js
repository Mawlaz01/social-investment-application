const express = require('express');
const router = express.Router();
const Acara = require('../../models/Acara');
const User = require('../../models/User');

// Middleware untuk autentikasi berbasis sesi
const auth = async (req, res, next) => {
    if (req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) return next();
    }
    res.redirect('/login');
};

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.session.userId; // Ambil user_id dari sesi
        let acara = await Acara.getAllByUserId(userId); // Ambil acara berdasarkan user_id
        res.render('user/acara', { acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat data acara');
        res.redirect('/users/dashboard');
    }
});

module.exports = router;
