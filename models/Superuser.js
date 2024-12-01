const connection = require('../config/db');
const bcrypt = require('bcryptjs');

class Superuser {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Superuser ORDER BY id_superuser DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async store(data) {
        data.password = await bcrypt.hash(data.password, 10);
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Superuser SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async login(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Superuser WHERE email = ?', [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Superuser WHERE id_superuser = ?', [id], (err, rows) => {
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
            connection.query('UPDATE Superuser SET ? WHERE id_superuser = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM Superuser WHERE id_superuser = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Superuser;
