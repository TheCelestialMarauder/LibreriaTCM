// src/models/usuario.js
const pool = require('./db');

async function obtenerPorEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, password, id_rol FROM usuarios WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
}

async function crearUsuario({ nombre, email, password, id_rol }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password, id_rol]
  );
  return result.insertId; // devuelve el ID del usuario recién creado
}

module.exports = {
  obtenerPorEmail,
  crearUsuario
};