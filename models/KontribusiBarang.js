const connection = require('../config/db');

class KontribusiBarang {
    static async getAllByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT kb.*, k.tanggal_sumbangan, k.tanggal_edit_sumbangan, k.status_validasi, u.nik, u.nama AS nama_penyumbang, u.no_wa FROM Kontribusi_Barang kb JOIN Kontribusi k ON kb.id_kontribusi = k.id_kontribusi JOIN User u ON k.id_penyumbang = u.id_user WHERE k.id_acara = ?`, [acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Kontribusi_Barang SET ?', data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi_Barang WHERE id_kontribusi_barang = ?', [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Kontribusi_Barang SET ? WHERE id_kontribusi_barang = ?', [data, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM Kontribusi_Barang WHERE id_kontribusi_barang = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getUnvalidatedByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT kb.*, k.tanggal_sumbangan, k.tanggal_edit_sumbangan, k.status_validasi, u.nik, u.nama AS nama_penyumbang FROM Kontribusi_Barang kb JOIN Kontribusi k ON kb.id_kontribusi = k.id_kontribusi JOIN User u ON k.id_penyumbang = u.id_user WHERE k.id_acara = ? AND k.status_validasi = 'belum divalidasi'`, [acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async updateValidasi(id_kontribusi, status) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Kontribusi SET status_validasi = ? WHERE id_kontribusi = ?';
            connection.query(query, [status, id_kontribusi], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getAllByUserIdAndAcaraId(userId, acaraId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Kontribusi_Barang.*, User.NIK, User.nama AS nama_penyumbang, User.no_wa, DATE_FORMAT(Kontribusi.tanggal_sumbangan, '%d/%m/%Y, %H.%i') AS tanggal_sumbangan, DATE_FORMAT(Kontribusi.tanggal_edit_sumbangan, '%d/%m/%Y, %H.%i') AS tanggal_edit_sumbangan, Kontribusi.status_validasi FROM Kontribusi_Barang JOIN Kontribusi ON Kontribusi_Barang.id_kontribusi = Kontribusi.id_kontribusi JOIN User ON Kontribusi.id_penyumbang = User.id_user WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.id_acara = ?`;
            connection.query(query, [userId, acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getTotalBarangByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) AS totalBarang FROM Kontribusi_Barang kb JOIN Kontribusi k ON kb.id_kontribusi = k.id_kontribusi WHERE k.id_penyumbang = ? AND k.status_validasi = 'valid'`;
            connection.query(query, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0].totalBarang);
            });
        });
    }

    static async getTotalBarangByCreatorId(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) AS totalBarang FROM Kontribusi_Barang kb JOIN Kontribusi k ON kb.id_kontribusi = k.id_kontribusi JOIN Acara a ON k.id_acara = a.id_acara WHERE a.id_pembuat_acara = ? AND k.status_validasi = 'valid'`;
            connection.query(query, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0].totalBarang);
            });
        });
    }
}

module.exports = KontribusiBarang;
