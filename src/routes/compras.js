// src/routes/compras.js
const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');
const { asegurarAutenticado } = require('../utils/auth');

// Añadir un libro al carrito (público, pero redirige a login si no hay sesión)
router.post('/add/:id', comprasController.agregarAlCarrito);

// Ver carrito (solo para usuario logueado)
router.get('/carrito', asegurarAutenticado, comprasController.verCarrito);

// Quitar un ejemplar del carrito
router.post('/remove/:id', asegurarAutenticado, comprasController.quitarDelCarrito);

// Procesar compra (checkout)
router.post('/checkout', asegurarAutenticado, comprasController.procesarCompra);

// Página de confirmación
router.get('/confirmacion', asegurarAutenticado, comprasController.confirmacionCompra);

module.exports = router;
