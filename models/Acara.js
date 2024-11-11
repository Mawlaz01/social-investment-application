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

    static async getAllByUserIdWithCreatorName(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT Acara.*, User.nama AS nama_pembuat
                FROM Acara
                JOIN User ON Acara.id_pembuat_acara = User.id_user
                WHERE Acara.id_pembuat_acara = ?
                ORDER BY Acara.id_acara DESC
            `;
            connection.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
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
                    resolve(rows.length ? rows[0] : null);
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
            connection.query(`
                SELECT COUNT(*) AS kontribusi_count
                FROM Kontribusi
                WHERE id_acara = ?
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const kontribusiCount = rows[0].kontribusi_count;
                    if (kontribusiCount > 0) {
                        reject(new Error('Acara tidak dapat dihapus karena masih ada kontribusi terkait.'));
                    } else {
                        connection.query('DELETE FROM Acara WHERE id_acara = ?', [id], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    }
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

static async isMoreThan7DaysOld(id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT DATEDIFF(NOW(), waktu_acara) AS days_old FROM Acara WHERE id_acara = ?', [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length === 0) {
                    reject(new Error("Acara tidak ditemukan"));
                } else {
                    resolve(rows[0].days_old > 7);
                }
            }
        });
    });
}
}

module.exports = Acara;
