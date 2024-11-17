const express = require('express');
const router = express.Router();
const Kontribusi = require('../../models/Kontribusi');
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

        const kontribusiList = await Kontribusi.getAllByUserId(userId);
        const acaraIds = [...new Set(kontribusiList.map(k => k.id_acara))];

        const acaraList = await Acara.getAllAcaraWithCreatorNameByUserContribution(userId);
        
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
        let acara = await Acara.getByIdWithCreatorName(acaraId);
        res.render('user/detail_investasi', { kontribusi, acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat detail investasi');
        res.redirect('/users/investasi');
    }
});

module.exports = router;
