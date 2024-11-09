const express = require('express');
const router = express.Router();
const Superuser = require('../../models/Superuser');
const User = require('../../models/User');
const Acara = require('../../models/Acara');

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


router.get('/dashboard', auth, async (req, res) => {
    try {
        if (!req.superuser) {
            req.flash('error', 'Data superuser tidak ditemukan.');
            return res.redirect('/login');
        }

        const totalAcaraPerBulan = await Acara.getTotalAcaraPerBulan();
        const totalPendaftarPerBulan = await User.getTotalPendaftarPerBulan();
        const labelsAcara = totalAcaraPerBulan.map(item => `${item.bulan}`);
        const dataAcara = totalAcaraPerBulan.map(item => item.total_acara);

        const labelsUser = totalPendaftarPerBulan.map(item => `${item.bulan}`);
        const dataUser = totalPendaftarPerBulan.map(item => item.total_pendaftar);

        res.render('superuser/dashboard', { 
            superuser: {
                ...req.superuser,
                dataUser: totalPendaftarPerBulan.reduce((acc, item) => acc + item.total_pendaftar, 0),
                dataAcara: totalAcaraPerBulan.reduce((acc, item) => acc + item.total_acara, 0)
            },
            labelsAcara,
            dataAcara,
            labelsUser,
            dataUser 
        });
        
    } catch (error) {
        console.error("Error rendering superuser dashboard:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat dashboard.');
        res.redirect('/login');
    }
});

router.get('/jumlah_acara', auth, async (req, res) => {
    try {
        if (!req.superuser) {
            req.flash('error', 'Data superuser tidak ditemukan.');
            return res.redirect('/login');
        }

        const totalAcaraPerBulan = await Acara.getTotalAcaraPerBulan();

        const labelsAcara = totalAcaraPerBulan.map(item => `${item.bulan}`);
        const dataAcara = totalAcaraPerBulan.map(item => item.total_acara);

        res.render('superuser/jumlah_acara', { 
            superuser: req.superuser, 
            labelsAcara,
            dataAcara 
        });
    } catch (error) {
        console.error("Error rendering superuser jumlah_acara:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat jumlah acara.');
        res.redirect('/login');
    }
});


router.get('/jumlah_user', auth, async (req, res) => {
    try {
        if (!req.superuser) {
            req.flash('error', 'Data superuser tidak ditemukan.');
            return res.redirect('/login');
        }

        const totalPendaftarPerBulan = await User.getTotalPendaftarPerBulan();

        const labelsUser = totalPendaftarPerBulan.map(item => `${item.bulan}`);
        const dataUser = totalPendaftarPerBulan.map(item => item.total_pendaftar);

        res.render('superuser/jumlah_user', { 
            superuser: req.superuser, 
            labelsUser,
            dataUser 
        });
    } catch (error) {
        console.error("Error rendering superuser jumlah_user:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat jumlah user.');
        res.redirect('/login');
    }
});

module.exports = router;
