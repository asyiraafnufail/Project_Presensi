// File: routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, completeTask } = require('../controllers/taskController');

// Definisikan Endpoint
router.get('/', getAllTasks);           // GET localhost:5001/tasks
router.post('/', createTask);           // POST localhost:5001/tasks
router.put('/:id/complete', completeTask); // PUT localhost:5001/tasks/1/complete

module.exports = router;