const express = require('express');
const router = express.Router();
const KontribusiUang = require('../../models/KontribusiUang');
const Kontribusi = require('../../models/Kontribusi');
const Acara = require('../../models/Acara');
const User = require('../../models/User');
const NotificationService = require('../../services/notificationService');

const auth = async (req, res, next) => {
    if (req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) return next();
    }
    res.redirect('/login');
};

router.get('/', auth, async (req, res) => {
    try {
        const acaraId = req.query.acaraId;
        const acara = await Acara.getById(acaraId);
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

router.post('/create', auth, async (req, res) => {
    try {
        const { nik, jumlah_uang, id_acara } = req.body;
        
        console.log('Jumlah Uang Diterima:', jumlah_uang);

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
            jumlah_uang: jumlahUangBersih
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
        const kontribusiId = req.params.id;
        const kontribusiUang = await KontribusiUang.getById(kontribusiId);
        const kontribusi = await Kontribusi.getById(kontribusiUang.id_kontribusi); // Ambil data kontribusi untuk mendapatkan id_acara
        kontribusiUang.id_acara = kontribusi.id_acara; // Tambahkan id_acara ke objek kontribusiUang
        res.render('user/edit_kontribusi_uang', { kontribusiUang });
    } catch (error) {
        console.error("Error:", error);
        req.flash('error', 'Terjadi kesalahan saat memuat halaman edit kontribusi uang');
        res.redirect('/users/detail_acara');
    }
});

router.post('/update/:id', auth, async (req, res) => {
    try {
        const kontribusiId = req.params.id;
        const { jumlah_uang, id_acara } = req.body;

        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(id_acara);
        if (isMoreThan7DaysOld) {
            req.flash('error', 'Tidak dapat mengedit kontribusi uang setelah 7 hari dari waktu acara');
            return res.redirect(`/users/detail_acara/${id_acara}`);
        }

        const jumlahUangBersih = parseInt(jumlah_uang.replace(/[^\d]/g, ''));

        const data = {
            jumlah_uang: jumlahUangBersih
        };

        await KontribusiUang.update(kontribusiId, data);
        
        await Kontribusi.update(kontribusiId, { tanggal_edit_sumbangan: new Date() });

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
