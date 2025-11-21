// File: routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Endpoint: /auth/register
router.post('/register', register);

// Endpoint: /auth/login
router.post('/login', login);

module.exports = router;