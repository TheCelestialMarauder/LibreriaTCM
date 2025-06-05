// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mostrar formulario de registro
router.get('/register', authController.mostrarFormularioRegistro);

// Procesar formulario de registro
router.post('/register', authController.procesarRegistro);

// (Por ahora dejamos las rutas de login/logout comentadas; 
// las implementaremos tras completar la parte de login)
// router.get('/login', authController.mostrarFormularioLogin);
// router.post('/login', authController.procesarLogin);
// router.get('/logout', authController.logout);

module.exports = router;