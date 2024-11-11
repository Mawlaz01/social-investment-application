const connection = require('../config/db');

class KontribusiUang {
    static async getAllByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT ku.*, k.tanggal_sumbangan, k.status_validasi, u.nik, u.nama AS nama_penyumbang 
                FROM Kontribusi_Uang ku 
                JOIN Kontribusi k ON ku.id_kontribusi = k.id_kontribusi 
                JOIN User u ON k.id_penyumbang = u.id_user 
                WHERE k.id_acara = ?
            `, [acaraId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Data dari database:", rows); // Log data untuk verifikasi
                    resolve(rows);
                }
            });
        });
    }

    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Kontribusi_Uang SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi_Uang WHERE id_kontribusi_uang = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Kontribusi_Uang SET ? WHERE id_kontribusi_uang = ?', [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM Kontribusi_Uang WHERE id_kontribusi_uang = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = KontribusiUang;
