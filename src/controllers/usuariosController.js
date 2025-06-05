// src/controllers/usuariosController.js
const usuarioModel = require('../models/usuario');
const rolModel = require('../models/rol');

module.exports = {
  // Listar todos los usuarios
  async listarUsuarios(req, res) {
    try {
      const usuarios = await usuarioModel.obtenerTodosUsuarios();
      res.render('usuarios/index', { usuarios, error: null });
    } catch (err) {
      console.error('Error listando usuarios:', err);
      res.status(500).send('Error al cargar la lista de usuarios.');
    }
  },

  // Mostrar formulario para crear usuario
  async mostrarFormularioCrear(req, res) {
    try {
      const roles = await rolModel.obtenerTodos();
      res.render('usuarios/create', { roles, error: null, formData: {} });
    } catch (err) {
      console.error('Error cargando formulario crear usuario:', err);
      res.status(500).send('Error interno.');
    }
  },

  // Procesar creación de usuario
  async procesarCrear(req, res) {
    const { nombre, email, password, id_rol } = req.body;
    const formData = { nombre, email, id_rol };

    try {
      // Validaciones básicas
      if (!nombre || !email || !password || !id_rol) {
        const roles = await rolModel.obtenerTodos();
        return res.render('usuarios/create', {
          roles,
          error: 'Todos los campos son obligatorios.',
          formData
        });
      }

      // Verificar que no exista otro usuario con ese email
      const existente = await usuarioModel.obtenerPorEmail(email);
      if (existente) {
        const roles = await rolModel.obtenerTodos();
        return res.render('usuarios/create', {
          roles,
          error: 'Ya existe un usuario con ese email.',
          formData
        });
      }

      await usuarioModel.crearUsuario({ nombre, email, password, id_rol });
      res.redirect('/usuarios');
    } catch (err) {
      console.error('Error creando usuario:', err);
      const roles = await rolModel.obtenerTodos();
      res.render('usuarios/create', {
        roles,
        error: 'Ocurrió un error al crear el usuario.',
        formData
      });
    }
  },

  // Mostrar formulario de edición
  async mostrarFormularioEditar(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.redirect('/usuarios');
    }

    try {
      const usuario = await usuarioModel.obtenerUsuarioPorId(id);
      if (!usuario) {
        return res.status(404).send('Usuario no encontrado.');
      }
      const roles = await rolModel.obtenerTodos();
      // formData cargado con los valores actuales (sin password)
      const formData = {
        nombre: usuario.nombre,
        email: usuario.email,
        id_rol: usuario.id_rol
      };
      res.render('usuarios/edit', { usuario, roles, error: null, formData });
    } catch (err) {
      console.error('Error cargando formulario editar usuario:', err);
      res.status(500).send('Error interno.');
    }
  },

  // Procesar edición de usuario
  async procesarEditar(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.redirect('/usuarios');
    }

    const { nombre, email, password, id_rol } = req.body;
    const formData = { nombre, email, id_rol };

    try {
      const usuario = await usuarioModel.obtenerUsuarioPorId(id);
      if (!usuario) {
        return res.status(404).send('Usuario no encontrado.');
      }

      // Validaciones básicas
      if (!nombre || !email || !id_rol) {
        const roles = await rolModel.obtenerTodos();
        return res.render('usuarios/edit', {
          usuario,
          roles,
          error: 'Nombre, email y rol son obligatorios.',
          formData
        });
      }

      // Si cambió el email, verificar no duplicar
      if (email !== usuario.email) {
        const existente = await usuarioModel.obtenerPorEmail(email);
        if (existente) {
          const roles = await rolModel.obtenerTodos();
          return res.render('usuarios/edit', {
            usuario,
            roles,
            error: 'Otro usuario ya utiliza ese email.',
            formData
          });
        }
      }

      await usuarioModel.actualizarUsuario(id, {
        nombre,
        email,
        password, // si viene vacío, el modelo lo ignora
        id_rol
      });

      res.redirect('/usuarios');
    } catch (err) {
      console.error('Error editando usuario:', err);
      const roles = await rolModel.obtenerTodos();
      res.render('usuarios/edit', {
        usuario: { id, ...formData },
        roles,
        error: 'Ocurrió un error al editar el usuario.',
        formData
      });
    }
  },

  // Eliminar usuario
  async eliminarUsuario(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.redirect('/usuarios');
    }

    try {
      // Opcional: evitar que un admin se elimine a sí mismo
      if (req.session.user && req.session.user.id === id) {
        const usuarios = await usuarioModel.obtenerTodosUsuarios();
        return res.render('usuarios/index', {
          usuarios,
          error: 'No puedes eliminar tu propia cuenta.'
        });
      }

      const afectadas = await usuarioModel.eliminarUsuario(id);
      if (afectadas === 0) {
        const usuarios = await usuarioModel.obtenerTodosUsuarios();
        return res.render('usuarios/index', {
          usuarios,
          error: 'Usuario no encontrado o ya eliminado.'
        });
      }

      res.redirect('/usuarios');
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      const usuarios = await usuarioModel.obtenerTodosUsuarios();
      res.render('usuarios/index', {
        usuarios,
        error: 'Ocurrió un error al eliminar el usuario.'
      });
    }
  }
};