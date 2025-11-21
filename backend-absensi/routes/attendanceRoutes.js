// File: routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { clockIn, clockOut, getHistory, getAllHistory} = require('../controllers/attendanceController');

router.post('/in', clockIn);     // POST localhost:5001/attendance/in
router.post('/out', clockOut);   // POST localhost:5001/attendance/out
router.get('/all', getAllHistory);
router.get('/:user_id', getHistory); 

module.exports = router;