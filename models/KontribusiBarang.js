const connection = require('../config/db');

class KontribusiBarang {
    static async getAllByAcaraId(id_acara) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi_Barang WHERE id_kontribusi IN (SELECT id_kontribusi FROM Kontribusi WHERE id_acara = ?)', [id_acara], (err, rows) => {
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
