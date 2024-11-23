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

    static async getAllByKontribusiId(id_kontribusi) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Validasi WHERE id_kontribusi = ?', [id_kontribusi], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async reportInvalidContribution(id_kontribusi, id_user_pelapor, laporan) {
        const data = {
            id_kontribusi,
            id_user_pelapor,
            laporan,
            waktu_validasi: new Date(),
        };
        return this.store(data);
    }

    static async updateValidasiStatus(id_kontribusi, status) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Kontribusi SET status_validasi = ? WHERE id_kontribusi = ?';
            connection.query(query, [status, id_kontribusi], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async getStatusByKontribusiId(id_kontribusi) {
        return new Promise((resolve, reject) => {
            const query = `SELECT status_laporan FROM Validasi WHERE id_kontribusi = ?`;
            connection.query(query, [id_kontribusi], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.length ? rows[0].status_laporan : null); 
            });
        });
    }
}

module.exports = Validasi;
