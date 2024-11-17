const express = require('express');
const router = express.Router();
const Acara = require('../../models/Acara');
const User = require('../../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/user/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const auth = async (req, res, next) => {
    if (!req.session.isSuperuser && req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) {
            res.locals.user = user;
            return next();
        }
    }
    res.redirect('/login');
};

router.get('/', auth, (req, res) => {
    res.render('user/create_acara');
});

router.post('/', auth, async (req, res) => {
    try {
        let { nama_acara, waktu_acara, acara_selesai, lokasi_acara, keterangan, informasi_kontak } = req.body;
        let id_pembuat_acara = req.session.userId;
        
        await Acara.store({
            nama_acara,
            waktu_acara,
            acara_selesai,
            lokasi_acara,
            keterangan,
            informasi_kontak,
            id_pembuat_acara
        });

        req.flash('success', 'Acara berhasil dibuat');
        res.redirect('/users/acara');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Gagal membuat acara. Silakan coba lagi.');
        res.redirect('/users/create_acara');
    }
});

module.exports = router;
