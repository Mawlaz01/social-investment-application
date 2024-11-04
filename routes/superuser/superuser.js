const express = require('express');
const router = express.Router();
const Superuser = require('../../models/Superuser');

const auth = async (req, res, next) => {
    try {
        console.log(req.session); 
        if (req.session.isSuperuser && req.session.userId) {
            const superuser = await Superuser.getById(req.session.userId);
            if (superuser) {
                req.superuser = superuser; 
                return next(); 
            }
        }
        req.flash('error', 'Anda harus login sebagai superuser untuk mengakses halaman ini.');
        res.redirect('/login');
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        req.flash('error', 'Terjadi kesalahan saat proses autentikasi.');
        res.redirect('/login');
    }
};


router.get('/dashboard', auth, (req, res) => {
    try {
        if (!req.superuser) {
            req.flash('error', 'Data superuser tidak ditemukan.');
            return res.redirect('/login');
        }
        res.render('superuser/dashboard', { superuser: req.superuser });
    } catch (error) {
        console.error("Error rendering superuser dashboard:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat dashboard.');
        res.redirect('/login');
    }
});

module.exports = router;
