// src/models/rol.js
const pool = require('./db');

async function obtenerTodos() {
  const [rows] = await pool.query(
    'SELECT id, nombre FROM roles ORDER BY nombre'
  );
  return rows;
}

async function obtenerPorNombre(nombreRol) {
  const [rows] = await pool.query(
    'SELECT id, nombre FROM roles WHERE nombre = ?',
    [nombreRol]
  );
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  obtenerTodos,
  obtenerPorNombre
};