const express = require('express');
const router = express.Router();
const User = require('../../models/User');

const auth = async (req, res, next) => {
    if (!req.session.isSuperuser && req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) return next();
    }
    res.redirect('/login');
};

router.get('/', auth, async (req, res) => {
    let user = await User.getById(req.session.userId);
    res.render('user/dashboard', { user });
});

module.exports = router;
