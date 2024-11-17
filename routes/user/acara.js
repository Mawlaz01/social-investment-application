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
    if (req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) {
            res.locals.user = user;
            return next();
        }
    }
    res.redirect('/login');
};

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.session.userId; 
        let acara = await Acara.getAllByUserIdWithCreatorName(userId); 
        res.render('user/acara', { acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat data acara');
        res.redirect('/users/dashboard');
    }
});

router.get('/detail_acara/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id; 
        let acara = await Acara.getById(acaraId);
        res.render('user/detail_acara', { acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat detail acara');
        res.redirect('/users/acara');
    }
});

module.exports = router;
