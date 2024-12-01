const express = require('express');
const router = express.Router();
const Kontribusi = require('../../models/Kontribusi');
const Validasi = require('../../models/Validasi');
const KontribusiBarang = require('../../models/KontribusiBarang');
const KontribusiUang = require('../../models/KontribusiUang');
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

router.get('/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id;
        const userId = req.session.userId;

        const isUserAuthorizedForAcara = await Kontribusi.isUserAuthorizedByAcaraId(acaraId, userId);
        if (!isUserAuthorizedForAcara) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengakses detail investasi ini');
            return res.redirect('/users/dashboard');
        }

        const kontribusiUang = await KontribusiUang.getAllByUserIdAndAcaraId(userId, acaraId);
        const kontribusiBarang = await KontribusiBarang.getAllByUserIdAndAcaraId(userId, acaraId);
        const acara = await Acara.getById(acaraId);

        const kontribusiUangWithStatus = await Promise.all(kontribusiUang.map(async item => {
            const laporan = await Validasi.getByKontribusiId(item.id_kontribusi);
            return { 
                ...item, 
                laporan: laporan.length > 0 ? laporan[0].laporan : '-', 
            };
        }));

        const kontribusiBarangWithStatus = await Promise.all(kontribusiBarang.map(async item => {
            const laporan = await Validasi.getByKontribusiId(item.id_kontribusi);
            return { 
                ...item, 
                laporan: laporan.length > 0 ? laporan[0].laporan : '-', 
            };
        }));

        res.render('user/detail_investasi', {
            acara,
            kontribusiUang: kontribusiUangWithStatus,
            kontribusiBarang: kontribusiBarangWithStatus
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Terjadi kesalahan saat memuat detail investasi');
    }
});

router.post('/validate', auth, async (req, res) => {
    try {
        const { id_kontribusi, jenis_kontribusi, acaraId } = req.body;

        if (jenis_kontribusi === 'uang') {
            await KontribusiUang.updateValidasi(id_kontribusi, 'valid');
        } else if (jenis_kontribusi === 'barang') {
            await KontribusiBarang.updateValidasi(id_kontribusi, 'valid');
        }

        await Kontribusi.updateValidasi(id_kontribusi, 'valid');

        res.redirect(`/users/detail_investasi/${acaraId}`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Terjadi kesalahan saat memvalidasi kontribusi');
    }
});

router.post('/lapor', auth, async (req, res) => {
    try {
        const { id_kontribusi, jenis_kontribusi, acaraId, laporan } = req.body;

        await Validasi.reportInvalidContribution(id_kontribusi, req.session.userId, laporan);

        if (jenis_kontribusi === 'uang') {
            await KontribusiUang.updateValidasi(id_kontribusi, 'tidak valid');
        } else if (jenis_kontribusi === 'barang') {
            await KontribusiBarang.updateValidasi(id_kontribusi, 'tidak valid');
        }

        await Kontribusi.updateValidasi(id_kontribusi, 'tidak valid');

        res.redirect(`/users/detail_investasi/${acaraId}`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Terjadi kesalahan saat melaporkan kontribusi');
    }
});

module.exports = router;