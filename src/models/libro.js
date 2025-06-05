// src/models/libro.js
const pool = require('./db');

// Obtener todos los libros (con JOIN a categorías y nombres de vendedor)
async function obtenerTodos() {
  const query = `
    SELECT l.id, l.titulo, l.autor, l.precio, l.stock,
           c.nombre AS categoria, u.nombre AS vendedor
    FROM libros l
    LEFT JOIN categorias c ON l.id_categoria = c.id
    JOIN usuarios u ON l.id_vendedor = u.id
    ORDER BY l.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
}

// Obtener un solo libro por su ID (incluye detalles)
async function obtenerPorId(id) {
  const query = `
    SELECT l.id, l.titulo, l.autor, l.descripcion, l.precio, l.stock,
           c.id AS id_categoria, c.nombre AS categoria,
           u.id AS id_vendedor, u.nombre AS vendedor, u.email AS vendedor_email
    FROM libros l
    LEFT JOIN categorias c ON l.id_categoria = c.id
    JOIN usuarios u ON l.id_vendedor = u.id
    WHERE l.id = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

// Obtener todos los libros de un vendedor específico
async function obtenerPorVendedor(idVendedor) {
  const query = `
    SELECT l.id, l.titulo, l.autor, l.precio, l.stock,
           c.nombre AS categoria
    FROM libros l
    LEFT JOIN categorias c ON l.id_categoria = c.id
    WHERE l.id_vendedor = ?
    ORDER BY l.created_at DESC
  `;
  const [rows] = await pool.query(query, [idVendedor]);
  return rows;
}

// Crear un nuevo libro
async function crearLibro({ titulo, autor, descripcion, precio, stock, id_categoria, id_vendedor }) {
  const query = `
    INSERT INTO libros (titulo, autor, descripcion, precio, stock, id_categoria, id_vendedor)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    titulo,
    autor || null,
    descripcion || null,
    precio,
    stock,
    id_categoria || null,
    id_vendedor
  ]);
  return result.insertId;
}

// Actualizar un libro existente
async function actualizarLibro(id, { titulo, autor, descripcion, precio, stock, id_categoria }) {
  const query = `
    UPDATE libros
    SET titulo = ?, autor = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?
    WHERE id = ?
  `;
  const [result] = await pool.query(query, [
    titulo,
    autor || null,
    descripcion || null,
    precio,
    stock,
    id_categoria || null,
    id
  ]);
  return result.affectedRows;
}

// Eliminar un libro
async function eliminarLibro(id) {
  const [result] = await pool.query(
    'DELETE FROM libros WHERE id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorVendedor,
  crearLibro,
  actualizarLibro,
  eliminarLibro
};