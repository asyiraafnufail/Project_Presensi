// File: controllers/attendanceController.js
const db = require('../config/db');

// 1. CHECK IN (Masuk)
const clockIn = async (req, res) => {
    const { user_id } = req.body;

    try {
        // Simpan data user_id dan waktu server otomatis (NOW)
        const query = `INSERT INTO attendance (user_id, check_in_time) VALUES (?, NOW())`;
        await db.query(query, [user_id]);
        
        res.status(201).json({ message: "Berhasil Check-In!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal Check-In", error });
    }
};

// 2. CHECK OUT (Pulang)
const clockOut = async (req, res) => {
    const { user_id } = req.body;

    try {
        // Cari data absen terakhir user ini yang belum check-out
        // Kita update kolom check_out_time dengan waktu sekarang
        const query = `
            UPDATE attendance 
            SET check_out_time = NOW() 
            WHERE user_id = ? AND check_out_time IS NULL 
            ORDER BY id DESC LIMIT 1
        `;
        
        const [result] = await db.query(query, [user_id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Kamu belum Check-In atau sudah Check-Out sebelumnya." });
        }

        res.json({ message: "Berhasil Check-Out! Hati-hati di jalan." });
    } catch (error) {
        res.status(500).json({ message: "Gagal Check-Out", error });
    }
};

// 3. LIHAT RIWAYAT (Opsional)
const getHistory = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [history] = await db.query(`SELECT * FROM attendance WHERE user_id = ? ORDER BY id DESC`, [user_id]);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil data", error });
    }
};

// [BARU] Untuk Admin: Lihat riwayat semua karyawan
const getAllHistory = async (req, res) => {
    try {
        // Join tabel attendance dengan users untuk dapat nama karyawan
        const query = `
            SELECT a.id, u.full_name, a.check_in_time, a.check_out_time 
            FROM attendance a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.check_in_time DESC
        `;
        const [history] = await db.query(query);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil data admin", error });
    }
};

// [UPDATE] Jangan lupa update module.exports di baris paling bawah
module.exports = { clockIn, clockOut, getHistory, getAllHistory };