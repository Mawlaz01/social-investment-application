const connection = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User ORDER BY id_user DESC', (err, rows) => {
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
        data.foto = data.foto || 'default.png';
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO User SET ?', data, (err, result) => {
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
            connection.query('SELECT * FROM User WHERE email = ?', [email], (err, result) => {
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
            connection.query('SELECT * FROM User WHERE id_user = ?', [id], (err, rows) => {
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
            connection.query('UPDATE User SET ? WHERE id_user = ?', [data, id], (err, result) => {
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
            connection.query('DELETE FROM User WHERE id_user = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = User;
