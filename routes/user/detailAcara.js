const express = require('express');
const router = express.Router();
const Acara = require('../../models/Acara');
const KontribusiUang = require('../../models/KontribusiUang');
const KontribusiBarang = require('../../models/KontribusiBarang');
const User = require('../../models/User');
const Kontribusi = require('../../models/Kontribusi');
const Validasi = require('../../models/Validasi');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
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
        const acara = await Acara.getById(acaraId);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengakses detail acara ini');
            return res.redirect('/users/dashboard');
        }

        const kontribusiUang = await KontribusiUang.getAllByAcaraId(acaraId);
        const kontribusiBarang = await KontribusiBarang.getAllByAcaraId(acaraId);
        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(acaraId);

        const totalUang = kontribusiUang.reduce((total, item) => total + item.jumlah_uang, 0);

        for (const item of kontribusiUang) {
            item.laporan = await Validasi.getAllByKontribusiId(item.id_kontribusi);
        }
        for (const item of kontribusiBarang) {
            item.laporan = await Validasi.getAllByKontribusiId(item.id_kontribusi);
        }

        res.render('user/detail_acara', {
            acara: {
                ...acara,
                waktu_acara: acara.waktu_acara.toISOString(),
                acara_selesai: acara.acara_selesai.toISOString()
            },
            kontribusiUang,
            kontribusiBarang,
            isMoreThan7DaysOld,
            totalUang
        });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat detail acara');
        res.redirect('/users/acara');
    }
});

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id;
        const acara = await Acara.getById(acaraId);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengedit acara ini');
            return res.redirect(`/users/detail_acara/${acaraId}`);
        }

        const formatDateForInput = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        };

        res.render('user/edit_detail_acara', {
            acara: {
                ...acara,
                waktu_acara: formatDateForInput(acara.waktu_acara),
                acara_selesai: formatDateForInput(acara.acara_selesai)
            }
        });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat halaman edit acara');
        res.redirect('/users/detail_acara/' + req.params.id);
    }
});

router.post('/update/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id;
        const { nama_acara, waktu_acara, acara_selesai, lokasi_acara, keterangan, informasi_kontak } = req.body;

        const acara = await Acara.getById(acaraId);

        if (acara.id_pembuat_acara !== req.session.userId) {
            req.flash('error', 'Anda tidak memiliki izin untuk mengupdate acara ini');
            return res.redirect(`/users/dashboard`);
        }

        await Acara.update(acaraId, { nama_acara, waktu_acara, acara_selesai, lokasi_acara, keterangan, informasi_kontak });

        const kontribusiUang = await KontribusiUang.getAllByAcaraId(acaraId);
        for (const kontribusi of kontribusiUang) {
            await Kontribusi.updateValidasi(kontribusi.id_kontribusi, 'belum divalidasi');
        }
        
        const kontribusiBarang = await KontribusiBarang.getAllByAcaraId(acaraId);
        for (const kontribusi of kontribusiBarang) {
            await Kontribusi.updateValidasi(kontribusi.id_kontribusi, 'belum divalidasi');
        }

        req.flash('success', 'Acara berhasil diperbarui');
        res.redirect('/users/detail_acara/' + acaraId);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memperbarui acara');
        res.redirect('/users/detail_acara/' + req.params.id);
    }
});

router.post('/delete/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id;

        const kontribusiCount = await Acara.getKontribusiCountByAcaraId(acaraId);

        if (kontribusiCount > 0) {
            req.flash('error', 'Acara tidak dapat dihapus karena masih ada kontribusi terkait.');
            return res.redirect('/users/detail_acara/' + acaraId);
        }

        await Acara.delete(acaraId);

        req.flash('success', 'Acara berhasil dihapus');
        res.redirect('/users/acara');
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat menghapus acara');
        res.redirect('/users/detail_acara/' + req.params.id);
    }
});


router.post('/lapor', auth, async (req, res) => {
    try {
        const { id_kontribusi, laporan, acaraId } = req.body;

        if (!acaraId) {
            throw new Error("ID Acara tidak ditemukan");
        }

        const userId = req.session.userId;
        await Validasi.store({ id_kontribusi, id_user_pelapor: userId, laporan });
        await Kontribusi.update(id_kontribusi, { status_validasi: 'tidak valid' });

        res.redirect(`/users/detail_acara/${acaraId}`);
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat melaporkan kontribusi yang tidak valid');
        res.redirect(`/users/detail_acara/${req.body.acaraId || req.params.id}`);
    }
});

module.exports = router;
