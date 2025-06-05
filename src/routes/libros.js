// src/routes/libros.js
const express = require('express');
const router = express.Router();
const librosController = require('../controllers/librosController');
const { asegurarAutenticado, verificarRol } = require('../utils/auth');

const ROLES_LIBROS = [1, 2]; // admin o vendedor

// Rutas públicas
router.get('/', librosController.listarLibros);
router.get('/:id', librosController.mostrarDetalle);

// Rutas protegidas (POST para eliminar)
router.get('/create/nuevo', asegurarAutenticado, verificarRol(ROLES_LIBROS), librosController.mostrarFormularioCrear);
router.post('/create/nuevo', asegurarAutenticado, verificarRol(ROLES_LIBROS), librosController.procesarCrear);

router.get('/edit/:id', asegurarAutenticado, verificarRol(ROLES_LIBROS), librosController.mostrarFormularioEditar);
router.post('/edit/:id', asegurarAutenticado, verificarRol(ROLES_LIBROS), librosController.procesarEditar);

// **Esta** ruta debe ser POST, no GET
router.post('/delete/:id', asegurarAutenticado, verificarRol(ROLES_LIBROS), librosController.eliminarLibro);

router.get('/mis-libros', asegurarAutenticado, verificarRol([2]), librosController.listarMisLibros);

module.exports = router;
