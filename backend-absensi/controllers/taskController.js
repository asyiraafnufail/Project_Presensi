// File: controllers/taskController.js
const db = require('../config/db');

// Ambil semua tugas yang belum selesai
const getAllTasks = async (req, res) => {
    try {
        // Kita filter status = 'pending' agar tugas selesai tidak muncul
        const [tasks] = await db.query(`SELECT * FROM tasks WHERE status = 'pending' ORDER BY created_at DESC`);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil data tugas", error });
    }
};

// Buat tugas baru (Hanya Admin yang harusnya bisa akses ini nanti)
const createTask = async (req, res) => {
    const { title, description, created_by } = req.body;

    try {
        const query = `INSERT INTO tasks (title, description, created_by) VALUES (?, ?, ?)`;
        await db.query(query, [title, description, created_by]);
        res.status(201).json({ message: "Tugas berhasil dibuat" });
    } catch (error) {
        res.status(500).json({ message: "Gagal buat tugas", error });
    }
};

// Tandai tugas sebagai selesai
const completeTask = async (req, res) => {
    const { id } = req.params; // ID Tugas dari URL
    const { user_id } = req.body; // ID User yang menyelesaikan

    try {
        const query = `UPDATE tasks SET status = 'selesai', completed_by = ? WHERE id = ?`;
        await db.query(query, [user_id, id]);
        res.json({ message: "Tugas selesai!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal update tugas", error });
    }
};

module.exports = { getAllTasks, createTask, completeTask };