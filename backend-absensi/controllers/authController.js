// File: controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import koneksi database

const SECRET_KEY = 'rahasia_negara_api'; // Idealnya simpan di file .env

// REGISTRASI USER
const register = async (req, res) => {
    const { username, password, role, full_name } = req.body;
    
    try {
        // Enkripsi password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)`;
        await db.query(query, [username, hashedPassword, role, full_name]);
        
        res.status(201).json({ message: "User berhasil didaftarkan!" });
    } catch (error) {
        res.status(500).json({ message: "Error registrasi", error });
    }
};

// LOGIN USER
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cari user berdasarkan username
        const [users] = await db.query(`SELECT * FROM users WHERE username = ?`, [username]);
        
        if (users.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        const user = users[0];

        // Cek password valid atau tidak
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Password salah" });

        // Buat Token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });

        res.json({ 
            message: "Login berhasil", 
            token, 
            user: { id: user.id, role: user.role, name: user.full_name } 
        });

    } catch (error) {
        res.status(500).json({ message: "Error login", error });
    }
};

module.exports = { register, login };