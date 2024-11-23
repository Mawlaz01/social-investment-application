const connection = require('../config/db');

class Kontribusi {
    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi WHERE id_kontribusi = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.length ? rows[0] : null);
                }
            });
        });
    }

    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Kontribusi SET ?', data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getAllByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi WHERE id_acara = ?', [acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getAllByUserId(userId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi WHERE id_penyumbang = ?', [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getAllUangByUserIdAndAcaraId(userId, acaraId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Kontribusi.*, User.NIK, User.nama AS nama_penyumbang, Kontribusi_Uang.jumlah_uang FROM Kontribusi JOIN User ON Kontribusi.id_penyumbang = User.id_user JOIN Kontribusi_Uang ON Kontribusi.id_kontribusi = Kontribusi_Uang.id_kontribusi WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.id_acara = ?`;
            connection.query(query, [userId, acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getAllBarangByUserIdAndAcaraId(userId, acaraId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Kontribusi.*, User.NIK, User.nama AS nama_penyumbang, Kontribusi_Barang.nama_barang, Kontribusi_Barang.jumlah_barang FROM Kontribusi JOIN User ON Kontribusi.id_penyumbang = User.id_user JOIN Kontribusi_Barang ON Kontribusi.id_kontribusi = Kontribusi_Barang.id_kontribusi WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.id_acara = ?`;
            connection.query(query, [userId, acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getAllByUserIdAndAcaraId(userId, acaraId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Kontribusi.*, User.NIK, User.nama AS nama_penyumbang, Kontribusi_Uang.jumlah_uang FROM Kontribusi JOIN User ON Kontribusi.id_penyumbang = User.id_user LEFT JOIN Kontribusi_Uang ON Kontribusi.id_kontribusi = Kontribusi_Uang.id_kontribusi LEFT JOIN Kontribusi_Barang ON Kontribusi.id_kontribusi = Kontribusi_Barang.id_kontribusi WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.id_acara = ?`;
            connection.query(query, [userId, acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            data.tanggal_edit_sumbangan = new Date();
            data.status_validasi = 'belum divalidasi';
            connection.query('UPDATE Kontribusi SET ? WHERE id_kontribusi = ?', [data, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM Kontribusi WHERE id_kontribusi = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
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

    static async getTotalUangByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT SUM(Kontribusi_Uang.jumlah_uang) AS total_uang FROM Kontribusi JOIN Kontribusi_Uang ON Kontribusi.id_kontribusi = Kontribusi_Uang.id_kontribusi WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.status_validasi = 'valid'`;
            connection.query(query, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.length ? rows[0].total_uang : 0);
            });
        });
    }

    static async isUserAuthorized(contributionId, userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Kontribusi WHERE id_kontribusi = ? AND id_penyumbang = ?';
            connection.query(query, [contributionId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.length > 0);
                }
            });
        });
    }

    static async isUserAuthorizedByAcaraId(acaraId, userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Kontribusi WHERE id_acara = ? AND id_penyumbang = ?';
            connection.query(query, [acaraId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.length > 0);
                }
            });
        });
    }

    static async getUnvalidated() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Kontribusi WHERE status_validasi = 'belum divalidasi'`;
            connection.query(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    
}

module.exports = Kontribusi;
