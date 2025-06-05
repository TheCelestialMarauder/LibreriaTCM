// src/models/venta.js
const pool = require('./db');

/**
 * Inserta una venta en la tabla ventas:
 * @param {Object} datos - { id_comprador, id_libro, cantidad, precio_unitario, total }
 * @returns {Number} insertId - ID de la venta creada
 */
async function crearVenta({ id_comprador, id_libro, cantidad, total }) {
  const query = `
    INSERT INTO ventas (id_libro, id_comprador, cantidad, total)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    id_libro,
    id_comprador,
    cantidad,
    total
  ]);
  return result.insertId;
}

module.exports = {
  crearVenta
};