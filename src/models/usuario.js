// src/models/usuario.js
const pool = require('./db');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios (incluyendo nombre de rol)
async function obtenerTodosUsuarios() {
  const query = `
    SELECT u.id, u.nombre, u.email, u.id_rol, r.nombre AS rol
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id
    ORDER BY u.id;
  `;
  const [rows] = await pool.query(query);
  return rows;
}

// Obtener un usuario por ID
async function obtenerUsuarioPorId(id) {
  const query = `
    SELECT u.id, u.nombre, u.email, u.id_rol, r.nombre AS rol
    FROM usuarios u
    JOIN roles r ON u.id_rol = r.id
    WHERE u.id = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

// Obtener un usuario por email (para login)
async function obtenerPorEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, password, id_rol FROM usuarios WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
}

// Crear un usuario nuevo (hash de contraseña incluido)
async function crearUsuario({ nombre, email, password, id_rol }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO usuarios (nombre, email, password, id_rol)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [nombre, email, hash, id_rol]);
  return result.insertId;
}

// Actualizar usuario (si envían nueva password, la encripta; si no, mantiene la existente)
async function actualizarUsuario(id, { nombre, email, password, id_rol }) {
  let query, params;

  if (password && password.trim() !== '') {
    // Si viene campo password, encriptarlo
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    query = `
      UPDATE usuarios
      SET nombre = ?, email = ?, password = ?, id_rol = ?
      WHERE id = ?
    `;
    params = [nombre, email, hash, id_rol, id];
  } else {
    // Sin cambiar contraseña
    query = `
      UPDATE usuarios
      SET nombre = ?, email = ?, id_rol = ?
      WHERE id = ?
    `;
    params = [nombre, email, id_rol, id];
  }

  const [result] = await pool.query(query, params);
  return result.affectedRows;
}

// Eliminar un usuario por ID
async function eliminarUsuario(id) {
  const [result] = await pool.query(
    'DELETE FROM usuarios WHERE id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  obtenerTodosUsuarios,
  obtenerUsuarioPorId,
  obtenerPorEmail,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};