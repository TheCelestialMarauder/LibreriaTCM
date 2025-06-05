// src/app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración de sesiones en memoria
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hora
  })
);

// Middleware para exponer datos de usuario en las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Body parser para formularios
app.use(express.urlencoded({ extended: false }));

// Carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas de autenticación (registro, login, logout)
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.render('index');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
