-- Script SQL para crear la base de datos y las tablas iniciales de la librería

-- 1. Crear la base de datos (si no existe) y usarla
CREATE DATABASE IF NOT EXISTS libreria
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE libreria;

-- 2. Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  rol ENUM('admin', 'vendedor', 'comprador') NOT NULL DEFAULT 'comprador',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) DEFAULT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  categoria VARCHAR(100) DEFAULT NULL,
  id_vendedor INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_libros_vendedor
    FOREIGN KEY (id_vendedor)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_libros_titulo (titulo),
  INDEX idx_libros_categoria (categoria),
  INDEX idx_libros_vendedor (id_vendedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_libro INT NOT NULL,
  id_comprador INT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cantidad INT NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_ventas_libro
    FOREIGN KEY (id_libro)
    REFERENCES libros(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_ventas_comprador
    FOREIGN KEY (id_comprador)
    REFERENCES usuarios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_ventas_fecha (fecha),
  INDEX idx_ventas_comprador (id_comprador),
  INDEX idx_ventas_libro (id_libro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Opcional: tabla para manejar sesiones (si se desea guardar sesiones en la BD)
-- (Solo si se planea usar un store de sesiones basado en MySQL)
CREATE TABLE IF NOT EXISTS sesiones (
  session_id VARCHAR(128) NOT NULL PRIMARY KEY,
  expires INT(11) NOT NULL,
  data BLOB
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;