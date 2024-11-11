const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../../models/User');

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
    let user = await User.getById(req.session.userId);
    res.render('user/dashboard', { user });
});

module.exports = router;
