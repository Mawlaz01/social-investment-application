const connection = require('../config/db');

class KontribusiUang {
    static async getAllByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT ku.*, k.tanggal_sumbangan, k.tanggal_edit_sumbangan, k.status_validasi, u.nik, u.nama AS nama_penyumbang, u.no_wa FROM Kontribusi_Uang ku JOIN Kontribusi k ON ku.id_kontribusi = k.id_kontribusi JOIN User u ON k.id_penyumbang = u.id_user WHERE k.id_acara = ?`, [acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Kontribusi_Uang SET ?', data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi_Uang WHERE id_kontribusi_uang = ?', [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Kontribusi_Uang SET ? WHERE id_kontribusi_uang = ?', [data, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM Kontribusi_Uang WHERE id_kontribusi_uang = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getUnvalidatedByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT ku.*, k.tanggal_sumbangan, k.tanggal_edit_sumbangan, k.status_validasi, u.nik, u.nama AS nama_penyumbang FROM Kontribusi_Uang ku JOIN Kontribusi k ON ku.id_kontribusi = k.id_kontribusi JOIN User u ON k.id_penyumbang = u.id_user WHERE k.id_acara = ? AND k.status_validasi = 'belum divalidasi'`, [acaraId], (err, rows) => {
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

    static async getTotalUangByCreatorId(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT SUM(Kontribusi_Uang.jumlah_uang) AS total_uang FROM Kontribusi_Uang JOIN Kontribusi ON Kontribusi_Uang.id_kontribusi = Kontribusi.id_kontribusi JOIN Acara ON Kontribusi.id_acara = Acara.id_acara WHERE Acara.id_pembuat_acara = ? AND Kontribusi.status_validasi = 'valid'`;
            connection.query(query, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.length ? rows[0].total_uang : 0);
            });
        });
    }

    static async getAllByUserIdAndAcaraId(userId, acaraId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Kontribusi_Uang.*, User.NIK, User.nama AS nama_penyumbang, User.no_wa, DATE_FORMAT(Kontribusi.tanggal_sumbangan, '%d/%m/%Y, %H.%i') AS tanggal_sumbangan, DATE_FORMAT(Kontribusi.tanggal_edit_sumbangan, '%d/%m/%Y, %H.%i') AS tanggal_edit_sumbangan, Kontribusi.status_validasi FROM Kontribusi_Uang JOIN Kontribusi ON Kontribusi_Uang.id_kontribusi = Kontribusi.id_kontribusi JOIN User ON Kontribusi.id_penyumbang = User.id_user WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.id_acara = ?`;
            connection.query(query, [userId, acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = KontribusiUang;
