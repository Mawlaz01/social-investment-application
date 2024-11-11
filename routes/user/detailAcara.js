const express = require('express');
const router = express.Router();
const Acara = require('../../models/Acara');
const KontribusiUang = require('../../models/KontribusiUang');
const KontribusiBarang = require('../../models/KontribusiBarang');
const User = require('../../models/User');
const Kontribusi = require('../../models/Kontribusi');
const Validasi = require('../../models/Validasi');
const connection = require('../../config/db'); // Tambahkan baris ini untuk mendefinisikan koneksi database

const auth = async (req, res, next) => {
    if (req.session.userId) {
        let user = await User.getById(req.session.userId);
        if (user) return next();
    }
    res.redirect('/login');
};

router.get('/:id', auth, async (req, res) => {
    try {
        const acaraId = req.params.id;
        const acara = await Acara.getById(acaraId);
        const kontribusiUang = await KontribusiUang.getAllByAcaraId(acaraId);
        const kontribusiBarang = await KontribusiBarang.getAllByAcaraId(acaraId);
        const isMoreThan7DaysOld = await Acara.isMoreThan7DaysOld(acaraId);

        const totalUang = kontribusiUang.reduce((total, item) => total + item.jumlah_uang, 0);

        console.log("Kontribusi Uang setelah proses:", kontribusiUang);

        res.render('user/detail_acara', { acara, kontribusiUang, kontribusiBarang, isMoreThan7DaysOld, totalUang });
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
        res.render('user/edit_detail_acara', { acara });
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

        await Acara.update(acaraId, { nama_acara, waktu_acara, acara_selesai, lokasi_acara, keterangan, informasi_kontak });

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

        const kontribusiCount = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT COUNT(*) AS kontribusi_count
                FROM Kontribusi
                WHERE id_acara = ?
            `, [acaraId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].kontribusi_count);
                }
            });
        });

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
