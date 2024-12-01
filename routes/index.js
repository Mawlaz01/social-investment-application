const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Superuser = require('../models/Superuser');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/user');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async function(req, res, next) {
    try {
        let data = await User.getAll();
        res.render('index', { data });
    } catch (error) {
        console.error("Error:", error);
        req.flash('invalid', 'Terjadi kesalahan saat memuat data pengguna');
        res.redirect('/login');
    }
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/faq', function(req, res) {
    res.render('faq');
});

router.get('/login', function(req, res) {
    res.render('auth/login_register');
});

router.get('/register_superuser', function(req, res) {
    res.render('auth/register_superuser');
});

router.post('/register', upload.single("foto"), async (req, res) => {
    try {
        let { nama, email, password, NIK, no_wa } = req.body;

        let userByEmail = await User.getByEmail(email);
        if (userByEmail) {
            req.flash('error', 'Email telah terdaftar');
            return res.redirect('/login');
        }

        let userByNIK = await User.getByNIK(NIK);
        if (userByNIK) {
            req.flash('error', 'NIK telah terdaftar, mohon cek kembali');
            return res.redirect('/login');
        }

        let userByNoWa = await User.getByNoWa(no_wa);
        if (userByNoWa) {
            req.flash('error', 'Nomor WA telah digunakan');
            return res.redirect('/login');
        }

        await User.store({
            nama,
            email,
            password,
            NIK,
            no_wa,
            foto: req.file ? req.file.filename : 'default.png'
        });

        req.flash('success', 'Akun berhasil terbuat');
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Registrasi gagal. Mohon coba lagi.');
        res.redirect('/login');
    }
});

router.post('/register_superuser', async (req, res) => {
    try {
        let { email, password } = req.body;
        let superuser = await Superuser.login(email);
        
        if (superuser) return res.redirect('/register_superuser');

        await Superuser.store({ email, password });

        req.flash('success', 'Superuser account created successfully');
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Superuser registration failed. Please try again.');
        res.redirect('/register_superuser');
    }
});

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        
        let user = await User.login(email);
        let superuser = await Superuser.login(email);

        if (!user && !superuser) {
            req.flash('error', 'Email salah');
            return res.redirect('/login');
        }

        let data = user || superuser;

        if (!(await bcrypt.compare(password, data.password))) {
            req.flash('error', 'Sandi salah');
            return res.redirect('/login');
        }

        if (user) {
            req.session.userId = user.id_user;
            req.session.isSuperuser = false;
            req.flash('success', 'Login berhasil');
            return res.redirect('/users/dashboard');
        } else if (superuser) {
            req.session.userId = superuser.id_superuser;
            req.session.isSuperuser = true;
            req.flash('success', 'Login berhasil');
            return res.redirect('/superuser/dashboard');
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Terjadi kesalahan saat login.');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/users/dashboard');
        res.redirect('/login');
    });
});

module.exports = router;
