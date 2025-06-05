// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { asegurarAutenticado, verificarRol } = require('../utils/auth');

// Solo admin (rol 1) puede gestionar usuarios
const ROLE_ADMIN = [1];

// Listar usuarios
router.get('/', asegurarAutenticado, verificarRol(ROLE_ADMIN), usuariosController.listarUsuarios);

// Crear usuario
router.get('/create', asegurarAutenticado, verificarRol(ROLE_ADMIN), usuariosController.mostrarFormularioCrear);
router.post('/create', asegurarAutenticado, verificarRol(ROLE_ADMIN), usuariosController.procesarCrear);

// Editar usuario
router.get('/edit/:id', asegurarAutenticado, verificarRol(ROLE_ADMIN), usuariosController.mostrarFormularioEditar);
router.post('/edit/:id', asegurarAutenticado, verificarRol(ROLE_ADMIN), usuariosController.procesarEditar);

// Eliminar usuario
router.post('/delete/:id', asegurarAutenticado, verificarRol(ROLE_ADMIN), usuariosController.eliminarUsuario);

module.exports = router;