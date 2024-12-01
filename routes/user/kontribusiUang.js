const express = require('express');
const router = express.Router();
const KontribusiUang = require('../../models/KontribusiUang');
const Kontribusi = require('../../models/Kontribusi');
const Acara = require('../../models/Acara');
const User = require('../../models/User');
const NotificationService = require('../../services/notificationService');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/kontribusi_uang/');
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
        const acaraId = req.query.acaraId;
        const acara = await Acara.getById(acaraId);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk menambahkan kontribusi uang pada acara ini');
            return res.redirect('/users/dashboard');
        }

        res.render('user/create_kontribusi_uang', { acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat halaman tambah kontribusi uang');
        res.redirect('/users/detail_acara');
    }
});

router.get('/search_nik', auth, async (req, res) => {
    try {
        const nik = req.query.nik;
        console.log('Mencari NIK:', nik);
        const user = await User.getByNIK(nik);
        if (user) {
            res.json({ nama: user.nama });
        } else {
            res.json({ nama: null });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mencari NIK' });
    }
});

router.post('/create', auth, upload.single('foto_kontribusi_uang'), async (req, res) => {
    try {
        const { nik, jumlah_uang, id_acara } = req.body;
        const foto_kontribusi_uang = req.file ? req.file.filename : null;

        const acara = await Acara.getById(id_acara);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk menambahkan kontribusi uang pada acara ini');
            return res.redirect('/users/dashboard');
        }

        const user = await User.getByNIK(nik);
        if (!user) {
            req.flash('error', 'Penyumbang dengan NIK tersebut tidak ditemukan');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(id_acara);
        if (isMoreThan7DaysOld) {
            req.flash('error', 'Tidak dapat menambah kontribusi uang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        const jumlahUangBersih = parseInt(jumlah_uang.replace(/[^\d]/g, ''));

        let kontribusiData = {
            id_acara,
            id_penyumbang: user.id_user,
            status_validasi: 'belum divalidasi'
        };
        const kontribusiResult = await Kontribusi.store(kontribusiData);

        let kontribusiUangData = {
            id_kontribusi: kontribusiResult.insertId,
            jumlah_uang: jumlahUangBersih,
            foto_kontribusi_uang
        };
        await KontribusiUang.store(kontribusiUangData);

        try {
            await NotificationService.sendWhatsAppMessage(user.id_user, 'Silakan lakukan validasi untuk kontribusi uang Anda.');
        } catch (notificationError) {
            console.error('Gagal mengirim notifikasi WhatsApp:', notificationError.message);
        }

        res.redirect(`/users/detail_acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat menambah kontribusi uang');
        res.redirect(`/users/detail_acara/${id_acara}`);
    }
});

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const kontribusiUangId = req.params.id;
        const kontribusiUang = await KontribusiUang.getById(kontribusiUangId);
        const kontribusi = await Kontribusi.getById(kontribusiUang.id_kontribusi);
        const acara = await Acara.getById(kontribusi.id_acara);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengedit kontribusi ini');
            return res.redirect('/users/dashboard');
        }

        kontribusiUang.id_acara = kontribusi.id_acara;
        res.render('user/edit_kontribusi_uang', { kontribusiUang });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat halaman edit kontribusi uang');
        res.redirect('/users/detail_acara');
    }
});

router.post('/update/:id', auth, upload.single('foto_kontribusi_uang'), async (req, res) => {
    try {
        const kontribusiUangId = req.params.id;
        const { jumlah_uang, id_acara } = req.body;
        let foto_kontribusi_uang = req.file ? req.file.filename : null;

        const kontribusiUang = await KontribusiUang.getById(kontribusiUangId);
        const kontribusi = await Kontribusi.getById(kontribusiUang.id_kontribusi);
        const acara = await Acara.getById(kontribusi.id_acara);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengupdate kontribusi ini');
            return res.redirect('/users/dashboard');
        }

        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(id_acara);
        if (isMoreThan7DaysOld) {
            req.flash('error', 'Tidak dapat mengedit kontribusi uang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        const jumlahUangBersih = parseInt(jumlah_uang.replace(/[^\d]/g, ''));

        if (!foto_kontribusi_uang) {
            foto_kontribusi_uang = kontribusiUang.foto_kontribusi_uang;
        }

        const data = {
            jumlah_uang: jumlahUangBersih,
            foto_kontribusi_uang
        };

        await KontribusiUang.update(kontribusiUangId, data);

        const updateData = { tanggal_edit_sumbangan: new Date() };
        await Kontribusi.update(kontribusi.id_kontribusi, updateData);

        await NotificationService.sendWhatsAppMessage(kontribusi.id_penyumbang, 'Kontribusi uang Anda telah diperbarui.');

        req.flash('success', 'Kontribusi uang berhasil diperbarui');
        res.redirect(`/users/detail_acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui kontribusi uang');
        res.redirect(`/users/detail_acara/${req.body.id_acara}`);
    }
});


router.post('/delete/:id', auth, async (req, res) => {
    try {
        const { id_acara } = req.body;

        if (!id_acara) {
            req.flash('error', 'ID acara tidak ditemukan');
            return res.redirect('/users/acara');
        }

        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(id_acara);
        if (isMoreThan7DaysOld) {
            req.flash('error', 'Tidak dapat menghapus kontribusi uang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        await KontribusiUang.delete(req.params.id);
        await Kontribusi.delete(req.params.id);

        req.flash('success', 'Kontribusi uang berhasil dihapus');
        return res.redirect(`/users/detail_acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat menghapus kontribusi uang');
        return res.redirect(`/users/detail_acara/${req.body.id_acara}`);
    }
});

module.exports = router;
