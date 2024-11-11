const connection = require('../config/db');

class Validasi {
    static async store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Validasi SET ?', data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Validasi', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getByKontribusiId(id_kontribusi) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Validasi WHERE id_kontribusi = ?', [id_kontribusi], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = Validasi;
