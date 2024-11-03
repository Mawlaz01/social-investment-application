const connection = require('../config/db');

class Acara {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Acara ORDER BY id_acara DESC', (err, rows) => {
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
            connection.query('INSERT INTO Acara SET ?', data, (err, result) => {
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
            connection.query('SELECT * FROM Acara WHERE id_acara = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

        static async findById(id) {
            return new Promise((resolve, reject) => {
                connection.query('SELECT * FROM Acara WHERE id_acara = ?', [id], (err, rows) => {
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
            connection.query('UPDATE Acara SET ? WHERE id_acara = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM Acara WHERE id_acara = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Acara;
