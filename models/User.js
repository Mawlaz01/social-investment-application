const connection = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // Retrieve all users
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User ORDER BY id_user DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Store a new user
    static async store(data) {
        data.password = await bcrypt.hash(data.password, 10); // Hash password
        data.foto = data.foto || 'default.png'; // Default foto
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO User SET ?', data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // Login user by email
    static async login(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE email = ?', [email], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }

    // Get user by ID
    static async getById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM User WHERE id_user = ?', [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows[0]);
            });
        });
    }

    // Update user data
    static async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10); // Hash password if provided
        }
        return new Promise((resolve, reject) => {
            connection.query('UPDATE User SET ? WHERE id_user = ?', [data, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    // Delete user by ID
    static async delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM User WHERE id_user = ?', [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = User;
