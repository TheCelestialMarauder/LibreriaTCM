// src/models/categoria.js
const pool = require('./db');

async function obtenerTodos() {
  const [rows] = await pool.query(
    'SELECT id, nombre FROM categorias ORDER BY nombre'
  );
  return rows;
}

module.exports = {
  obtenerTodos
};