const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// Middleware for session-based authentication
function isAuthenticated(req, res, next) {
    if (req.session.userId) {  // Check if user is authenticated
        return next();
    } else {
        res.redirect('/login');
    }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.getById(userId);
        res.render('user/profile', { user });
    } catch (error) {
        res.status(500).send('Error retrieving user profile.');
    }
});

router.post('/update', isAuthenticated, upload.single('foto'), async (req, res) => {
    try {
        const userId = req.session.userId;

        const oldUserData = await User.getById(userId);

        const updatedData = {
            nama: req.body.nama,
            email: req.body.email,
            NIK: req.body.NIK,
            no_wa: req.body.no_wa,
            foto: req.file ? req.file.filename : undefined
        };

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            updatedData.password = hashedPassword;
        }

        if (updatedData.foto) {
            if (oldUserData.foto && oldUserData.foto !== 'default.png') {
                fs.unlinkSync(path.join(__dirname, '../../public/images/users/', oldUserData.foto));
            }
        } else {
            delete updatedData.foto;
        }

        await User.update(userId, updatedData);

        res.redirect('/users/profile');
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send('Error updating user profile.');
    }
});

module.exports = router;
