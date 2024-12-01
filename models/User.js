const connection = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User ORDER BY id_user DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async store(data) {
        data.password = await bcrypt.hash(data.password, 10);
        data.foto = data.foto || 'default.png';
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO User SET ?', data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async login(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE email = ?', [email], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE id_user = ?', [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    static async getByNIK(nik) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE NIK = ?', [nik], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    static async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return new Promise((resolve, reject) => {
            connection.query('UPDATE User SET ? WHERE id_user = ?', [data, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM User WHERE id_user = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getByEmail(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE email = ?', [email], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    static async getByNoWa(no_wa) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE no_wa = ?', [no_wa], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }


    static async getTotalPendaftarPerBulan() { 
        return new Promise((resolve, reject) => {
            const sql = `SELECT MONTH(tanggal_daftar) AS bulan, COUNT(id_user) AS total_pendaftar FROM User WHERE YEAR(tanggal_daftar) = YEAR(CURDATE()) GROUP BY MONTH(tanggal_daftar) ORDER BY bulan;`;
            connection.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                    const result = Array(12).fill(0).map((_, i) => ({
                        bulan: namaBulan[i],
                        total_pendaftar: 0
                    }));
    
                    rows.forEach(row => {
                        if (row.bulan >= 1 && row.bulan <= 12) {
                            result[row.bulan - 1].total_pendaftar = row.total_pendaftar;
                        }
                    });
    
                    resolve(result);
                }
            });
        });
    }  
}

module.exports = User;
