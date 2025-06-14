// src/controllers/authController.js
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuario');
const rolModel = require('../models/rol');
const { sendMail } = require('../utils/mailer');

module.exports = {
  // Muestra el formulario de registro con el listado de roles
  async mostrarFormularioRegistro(req, res) {
    try {
      const roles = await rolModel.obtenerTodos();
      res.render('auth/register', { roles, error: null, formData: {} });
    } catch (err) {
      console.error('Error cargando roles para registro:', err);
      res.status(500).send('Error interno al cargar formulario de registro.');
    }
  },

  // Procesa los datos del formulario de registro
  async procesarRegistro(req, res) {
    const { nombre, email, password, rolSelec } = req.body;
    const formData = { nombre, email, rolSelec };

    try {
      // 1. Validación simple de campos vacíos
      if (!nombre || !email || !password || !rolSelec) {
        const roles = await rolModel.obtenerTodos();
        return res.render('auth/register', {
          roles,
          error: 'Todos los campos son obligatorios.',
          formData
        });
      }

      // 2. Verificar que el email no exista ya en la base de datos
      const usuarioExistente = await usuarioModel.obtenerPorEmail(email);
      if (usuarioExistente) {
        const roles = await rolModel.obtenerTodos();
        return res.render('auth/register', {
          roles,
          error: 'El email ya está registrado.',
          formData
        });
      }

      // 3. Validar que el rol seleccionado exista en tabla roles
      const rol = await rolModel.obtenerPorNombre(rolSelec);
      if (!rol) {
        const roles = await rolModel.obtenerTodos();
        return res.render('auth/register', {
          roles,
          error: 'Rol inválido.',
          formData
        });
      }

      // 4. Hashear la contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 5. Insertar usuario en BD
      const nuevoUsuario = {
        nombre,
        email,
        password: passwordHash,
        id_rol: rol.id
      };
      const idUsuario = await usuarioModel.crearUsuario(nuevoUsuario);

      // 6. Enviar correo de bienvenida (async, pero no esperamos su resultado para redirigir)
      const htmlBienvenida = `
        <h1>Bienvenido a la Librería, ${nombre}!</h1>
        <p>Te has registrado correctamente como <strong>${rolSelec}</strong>.</p>
        <p>Ahora puedes iniciar sesión para empezar a usar la plataforma.</p>
      `;
      sendMail({
        to: email,
        subject: '¡Bienvenido a la LibreríaTCM!',
        html: htmlBienvenida
      }).catch(err => console.error('Error enviando correo de bienvenida:', err));

      // 7. Redirigir a la página de login
      res.redirect('/login');
    } catch (err) {
      console.error('Error procesando registro:', err);
      const roles = await rolModel.obtenerTodos();
      res.render('auth/register', {
        roles,
        error: 'Ocurrió un error al registrar. Intente nuevamente.',
        formData
      });
    }
  },

  // Mostrar formulario de login
  async mostrarFormularioLogin(req, res) {
    res.render('auth/login', { error: null, formData: {} });
  },

  // Procesar login
  async procesarLogin(req, res) {
    const { email, password } = req.body;
    const formData = { email };

    try {
      // 1) Buscar usuario por email
      const usuario = await usuarioModel.obtenerPorEmail(email);
      if (!usuario) {
        return res.render('auth/login', {
          error: 'Email o contraseña incorrectos.',
          formData
        });
      }

      // 2) Comparar contraseña
      const match = await bcrypt.compare(password, usuario.password);
      if (!match) {
        return res.render('auth/login', {
          error: 'Email o contraseña incorrectos.',
          formData
        });
      }

      // 3) Guardar información mínima en session (sin la contraseña)
      req.session.user = {
        id: usuario.id,
        nombre: usuario.nombre,
        id_rol: usuario.id_rol,
        email: usuario.email
      };

      // 4) Redirigir a la página principal o a “mis-libros”
      res.redirect('/');
    } catch (err) {
      console.error('Error procesando login:', err);
      res.render('auth/login', {
        error: 'Ocurrió un error. Intenta de nuevo.',
        formData
      });
    }
  },

  // Logout sencillo
  logout(req, res) {
    req.session.destroy(err => {
      if (err) console.error('Error al destruir sesión:', err);
      res.redirect('/');
    });
  }
};