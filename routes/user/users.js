const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const auth = async (req, res, next) => {
  if (!req.session.isSuperuser && req.session.userId) {
      let user = await User.getById(req.session.userId);
      if (user) return next();
  }
  res.redirect('/login');
};

router.get('/dashboard', auth, async (req, res) => {
    let user = await User.getById(req.session.userId);
    res.render('user/dashboard', { user });
});

router.get('/profile', auth, async (req, res) => {
    let user = await User.getById(req.session.userId);
    res.render('user/profile', { user });
});

router.post('/update/:id', auth, upload.single("foto"), async (req, res) => {
    try {
        const id = req.params.id;
        let filebaru = req.file ? req.file.filename : null;
        let user = await User.getById(id);
        const namaFileLama = user.foto;

        if (filebaru && namaFileLama !== 'default.png') {
            const pathFileLama = path.join(__dirname, '../public/images/users', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }

        let { nama, NIK, no_wa, email } = req.body;

        let data = {
            nama,
            NIK,
            no_wa,
            email,
            foto: filebaru || namaFileLama
        };

        await User.update(id, data);
        req.flash("success", "Berhasil mengupdate data profil");
        res.redirect("/users/profile");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
