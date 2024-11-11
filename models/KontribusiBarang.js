const connection = require('../config/db');

class KontribusiBarang {
    static async getAllByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT kb.*, k.tanggal_sumbangan, k.tanggal_edit_sumbangan, k.status_validasi, u.nik, u.nama AS nama_penyumbang
                FROM Kontribusi_Barang kb
                JOIN Kontribusi k ON kb.id_kontribusi = k.id_kontribusi
                JOIN User u ON k.id_penyumbang = u.id_user
                WHERE k.id_acara = ?
            `, [acaraId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Kontribusi_Barang SET ?', data, (err, result) => {
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
            connection.query('SELECT * FROM Kontribusi_Barang WHERE id_kontribusi_barang = ?', [id], (err, rows) => {
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
            connection.query('UPDATE Kontribusi_Barang SET ? WHERE id_kontribusi_barang = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM Kontribusi_Barang WHERE id_kontribusi_barang = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = KontribusiBarang;
