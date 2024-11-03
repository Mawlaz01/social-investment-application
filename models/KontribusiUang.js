const connection = require('../config/db');

class KontribusiUang {
    static async getAllByAcaraId(id_acara) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Kontribusi_Uang WHERE id_kontribusi IN (SELECT id_kontribusi FROM Kontribusi WHERE id_acara = ?)', [id_acara], (err, rows) => {
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
            connection.query('INSERT INTO Kontribusi_Uang SET ?', data, (err, result) => {
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
