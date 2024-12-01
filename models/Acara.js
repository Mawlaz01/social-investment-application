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

    static async isUserAuthorized(acaraId, userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Acara WHERE id_acara = ? AND id_pembuat_acara = ?';
            connection.query(query, [acaraId, userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.length > 0);
                }
            });
        });
    }
    

    static async getAllByUserIdWithCreatorName(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT Acara.*, User.nama AS nama_pembuat FROM Acara JOIN User ON Acara.id_pembuat_acara = User.id_user WHERE Acara.id_pembuat_acara = ? ORDER BY Acara.id_acara DESC`;
            connection.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static async getAllAcaraWithCreatorNameByUserContribution(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT DISTINCT Acara.*, User.nama AS nama_pembuat FROM Kontribusi JOIN Acara ON Kontribusi.id_acara = Acara.id_acara JOIN User ON Acara.id_pembuat_acara = User.id_user WHERE Kontribusi.id_penyumbang = ? ORDER BY Acara.id_acara DESC`;
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
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
            connection.query(`SELECT COUNT(*) AS kontribusi_count FROM Kontribusi WHERE id_acara = ?`, [id], (err, rows) => {
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
            const sql = `SELECT MONTH(waktu_acara) AS bulan, COUNT(id_acara) AS total_acara FROM acara WHERE YEAR(waktu_acara) = YEAR(CURDATE()) GROUP BY MONTH(waktu_acara) ORDER BY bulan;`;
            connection.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
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
                    resolve(rows[0].days_old > 7);
                }
            });
        });
    }

    static async getUnvalidatedByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT DISTINCT Acara.*, User.nama AS nama_pembuat FROM Acara JOIN Kontribusi ON Acara.id_acara = Kontribusi.id_acara JOIN User ON Acara.id_pembuat_acara = User.id_user WHERE Kontribusi.id_penyumbang = ? AND Kontribusi.status_validasi = 'belum divalidasi' ORDER BY Acara.id_acara DESC`;
            connection.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static async getDetailById(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT a.*, GROUP_CONCAT(DISTINCT ku.id_kontribusi_uang, ':', ku.jumlah_uang) as kontribusi_uang, GROUP_CONCAT(DISTINCT kb.id_kontribusi_barang, ':', kb.nama_barang, ':', kb.jumlah_barang) as kontribusi_barang FROM Acara a LEFT JOIN Kontribusi k ON a.id_acara = k.id_acara LEFT JOIN Kontribusi_Uang ku ON k.id_kontribusi = ku.id_kontribusi LEFT JOIN Kontribusi_Barang kb ON k.id_kontribusi = kb.id_kontribusi WHERE a.id_acara = ? GROUP BY a.id_acara`, [acaraId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.length ? rows[0] : null);
                }
            });
        });
    }

    static async getKontribusiCountByAcaraId(acaraId) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(*) AS kontribusi_count FROM Kontribusi WHERE id_acara = ?`, [acaraId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0].kontribusi_count);
            });
        });
    }

}

module.exports = Acara;
