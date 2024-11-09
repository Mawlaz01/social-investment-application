const connection = require('../config/db');

class Acara {
    static async getAllByUserId(userId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Acara WHERE id_pembuat_acara = ? ORDER BY id_acara DESC', [userId], (err, rows) => {
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

    static async getTotalAcaraPerBulan() { 
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                MONTH(waktu_acara) AS bulan,
                COUNT(id_acara) AS total_acara
            FROM 
                acara
            WHERE 
                YEAR(waktu_acara) = YEAR(CURDATE()) 
            GROUP BY 
                MONTH(waktu_acara)
            ORDER BY 
                bulan;
        `;
        connection.query(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {

                const namaBulan = [
                    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ];

                const result = Array(12).fill(0).map((_, i) => ({
                    bulan: namaBulan[i],
                    total_acara: 0
                }));

                rows.forEach(row => {
                    if (row.bulan >= 1 && row.bulan <= 12) {
                        result[row.bulan - 1].total_acara = row.total_acara;
                    }
                });

                resolve(result);
            }
        });
    });
    }
}

module.exports = Acara;
