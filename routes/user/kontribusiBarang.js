const express = require('express');
const router = express.Router();
const KontribusiBarang = require('../../models/KontribusiBarang');
const Kontribusi = require('../../models/Kontribusi');
const Acara = require('../../models/Acara');
const User = require('../../models/User');
const NotificationService = require('../../services/notificationService');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/kontribusi_barang/');
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
            req.flash('error', 'Anda tidak memiliki izin untuk menambahkan kontribusi barang pada acara ini');
            return res.redirect('/users/dashboard');
        }

        res.render('user/create_kontribusi_barang', { acara });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat halaman tambah kontribusi barang');
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

router.post('/create', auth, upload.single('foto_kontribusi_barang'), async (req, res) => {
    try {
        const { nik, nama_barang, jumlah_barang, id_acara } = req.body;
        const foto_kontribusi_barang = req.file ? req.file.filename : null;

        const acara = await Acara.getById(id_acara);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk menambahkan kontribusi barang pada acara ini');
            return res.redirect('/users/dashboard');
        }

        const user = await User.getByNIK(nik);
        if (!user) {
            req.flash('error', 'Penyumbang dengan NIK tersebut tidak ditemukan');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(id_acara);
        if (isMoreThan7DaysOld) {
            req.flash('error', 'Tidak dapat menambah kontribusi barang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        let kontribusiData = {
            id_acara,
            id_penyumbang: user.id_user,
            status_validasi: 'belum divalidasi'
        };
        const kontribusiResult = await Kontribusi.store(kontribusiData);

        let kontribusiBarangData = {
            id_kontribusi: kontribusiResult.insertId,
            nama_barang,
            jumlah_barang,
            foto_kontribusi_barang
        };
        await KontribusiBarang.store(kontribusiBarangData);

        try {
            await NotificationService.sendWhatsAppMessage(user.id_user, 'Silakan lakukan validasi untuk kontribusi barang Anda.');
        } catch (notificationError) {
            console.error('Gagal mengirim notifikasi WhatsApp:', notificationError.message);
        }

        res.redirect(`/users/detail_acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat menambah kontribusi barang');
        res.redirect(`/users/detail_acara/${req.body.id_acara}`);
    }
});

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const kontribusiBarangId = req.params.id;
        const kontribusiBarang = await KontribusiBarang.getById(kontribusiBarangId);
        const kontribusi = await Kontribusi.getById(kontribusiBarang.id_kontribusi);
        const acara = await Acara.getById(kontribusi.id_acara);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengedit kontribusi ini');
            return res.redirect('/users/dashboard');
        }

        kontribusiBarang.id_acara = kontribusi.id_acara;
        res.render('user/edit_kontribusi_barang', { kontribusiBarang });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat halaman edit kontribusi barang');
        res.redirect('/users/detail_acara');
    }
});

router.post('/update/:id', auth, upload.single('foto_kontribusi_barang'), async (req, res) => {
    try {
        const kontribusiBarangId = req.params.id;
        const { nama_barang, jumlah_barang, id_acara } = req.body;
        let foto_kontribusi_barang = req.file ? req.file.filename : null;

        const kontribusiBarang = await KontribusiBarang.getById(kontribusiBarangId);
        const kontribusi = await Kontribusi.getById(kontribusiBarang.id_kontribusi);
        const acara = await Acara.getById(kontribusi.id_acara);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengupdate kontribusi ini');
            return res.redirect('/users/dashboard');
        }

        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(id_acara);
        if (isMoreThan7DaysOld) {
            req.flash('error', 'Tidak dapat mengedit kontribusi barang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        if (!foto_kontribusi_barang) {
            foto_kontribusi_barang = kontribusiBarang.foto_kontribusi_barang;
        }

        const data = {
            nama_barang,
            jumlah_barang,
            foto_kontribusi_barang
        };

        await KontribusiBarang.update(kontribusiBarangId, data);

        const updateData = { tanggal_edit_sumbangan: new Date() };
        await Kontribusi.update(kontribusi.id_kontribusi, updateData);

        req.flash('success', 'Kontribusi barang berhasil diperbarui');
        res.redirect(`/users/detail_acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui kontribusi barang');
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
            req.flash('error', 'Tidak dapat menghapus kontribusi barang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        await KontribusiBarang.delete(req.params.id);

        await Kontribusi.delete(req.params.id);

        req.flash('success', 'Kontribusi barang berhasil dihapus');
        return res.redirect(`/users/detail_acara/${id_acara}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat menghapus kontribusi barang');
        return res.redirect(`/users/detail_acara/${id_acara}`);
    }
});

module.exports = router;
