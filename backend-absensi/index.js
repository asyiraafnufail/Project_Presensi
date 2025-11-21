// File: backend-absensi/index.js
const express = require('express');
const cors = require('cors');

// Import Routes (Pastikan file-file ini ada di folder routes)
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');           // <--- PENTING
const attendanceRoutes = require('./routes/attendanceRoutes'); // <--- PENTING

const app = express();
const PORT = 5001; // Sesuaikan dengan port backend kamu

app.use(cors());
app.use(express.json());

// ==============================
// DAFTARKAN RUTE DI SINI
// ==============================

// 1. Jalur Auth (Login/Register)
app.use('/auth', authRoutes);

// 2. Jalur Tasks (Tugas) - Ini yang bikin error 404 tadi
app.use('/tasks', taskRoutes);

// 3. Jalur Attendance (Presensi) - Ini juga bikin error 404
app.use('/attendance', attendanceRoutes);


// Cek server jalan
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});