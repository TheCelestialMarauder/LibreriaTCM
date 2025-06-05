require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Exponer usuario en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Body parser
app.use(express.urlencoded({ extended: false }));

// Público: archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Rutas de libros
const librosRoutes = require('./routes/libros');
app.use('/libros', librosRoutes);

// Rutas de compras (carrito, checkout)
const comprasRoutes = require('./routes/compras');
app.use('/compras', comprasRoutes);


const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('index');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
