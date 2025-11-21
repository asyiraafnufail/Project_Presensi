// File: db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',     
    password: '',   
    database: 'absensi_app', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kita gunakan promise agar bisa pakai async/await yang lebih rapi
const db = pool.promise();

module.exports = db;