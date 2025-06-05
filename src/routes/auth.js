// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro
router.get('/register', authController.mostrarFormularioRegistro);
router.post('/register', authController.procesarRegistro);

// Login
router.get('/login', authController.mostrarFormularioLogin);
router.post('/login', authController.procesarLogin);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
