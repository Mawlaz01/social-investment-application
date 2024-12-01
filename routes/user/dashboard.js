const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../../models/User');
const Acara = require('../../models/Acara');
const Kontribusi = require('../../models/Kontribusi');
const KontribusiUang = require('../../models/KontribusiUang');
const KontribusiBarang = require('../../models/KontribusiBarang');

const auth = async (req, res, next) => {
    if (!req.session.isSuperuser && req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) return next();
    }
    res.redirect('/login');
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/user/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', auth, async (req, res) => {
    try {
        let user = await User.getById(req.session.userId);

        const unvalidatedAcara = await Acara.getUnvalidatedByUserId(req.session.userId);

        const totalUangDisumbangkan = await Kontribusi.getTotalUangByUserId(req.session.userId);

        const totalUangDiterima = await KontribusiUang.getTotalUangByCreatorId(req.session.userId);

        const totalBarangDisumbangkan = await KontribusiBarang.getTotalBarangByUserId(req.session.userId);
        
        const totalBarangDiterima = await KontribusiBarang.getTotalBarangByCreatorId(req.session.userId);

        res.render('user/dashboard', {
            user,
            unvalidatedAcara,
            totalUangDisumbangkan,
            totalUangDiterima,
            totalBarangDisumbangkan, 
            totalBarangDiterima 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Terjadi kesalahan saat memuat dashboard');
    }
});

module.exports = router;
