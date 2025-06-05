// src/controllers/librosController.js
const libroModel = require('../models/libro');
const categoriaModel = require('../models/categoria'); 
// (asumimos que tienes un modelo similar a rol para categorías)
                      // mirar abajo ejemplo de categoriaModel
module.exports = {
  // LISTAR TODOS LOS LIBROS (público)
  async listarLibros(req, res) {
    try {
      const libros = await libroModel.obtenerTodos();
      res.render('libros/index', { libros });
    } catch (err) {
      console.error('Error listando libros:', err);
      res.status(500).send('Error al cargar la lista de libros.');
    }
  },

  // VER DETALLE DE 1 LIBRO (público)
  async mostrarDetalle(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.redirect('/libros');
    }

    try {
      const libro = await libroModel.obtenerPorId(id);
      if (!libro) {
        return res.status(404).send('Libro no encontrado.');
      }
      res.render('libros/detalle', { libro });
    } catch (err) {
      console.error('Error mostrando detalle:', err);
      return res.status(500).send('Error al cargar el detalle del libro.');
    }
  },

  // FORMULARIO PARA CREAR UN NUEVO LIBRO (solo vendedor/admin)
  async mostrarFormularioCrear(req, res) {
    try {
      const categorias = await categoriaModel.obtenerTodos();
      res.render('libros/create', { categorias, error: null, formData: {} });
    } catch (err) {
      console.error('Error cargando formulario crear libro:', err);
      res.status(500).send('Error interno.');
    }
  },

  // PROCESAR CREAR LIBRO (solo vendedor/admin)
  async procesarCrear(req, res) {
    const { titulo, autor, descripcion, precio, stock, id_categoria } = req.body;
    const id_vendedor = req.session.user.id;
    const formData = { titulo, autor, descripcion, precio, stock, id_categoria };
    try {
      // Validación mínima
      if (!titulo || !precio || !stock) {
        const categorias = await categoriaModel.obtenerTodos();
        return res.render('libros/create', {
          categorias,
          error: 'Título, precio y stock son obligatorios.',
          formData
        });
      }

      // Precio y stock a números
      const precioNum = parseFloat(precio);
      const stockNum = parseInt(stock, 10);
      if (isNaN(precioNum) || isNaN(stockNum)) {
        const categorias = await categoriaModel.obtenerTodos();
        return res.render('libros/create', {
          categorias,
          error: 'Precio y stock deben ser números válidos.',
          formData
        });
      }

      // Crear en BD
      await libroModel.crearLibro({
        titulo,
        autor,
        descripcion,
        precio: precioNum,
        stock: stockNum,
        id_categoria: id_categoria || null,
        id_vendedor
      });

      res.redirect('/libros');
    } catch (err) {
      console.error('Error creando libro:', err);
      const categorias = await categoriaModel.obtenerTodos();
      res.render('libros/create', {
        categorias,
        error: 'Ocurrió un error al crear el libro.',
        formData
      });
    }
  },

  // FORMULARIO PARA EDITAR UN LIBRO EXISTENTE (solo vendedor/admin, propietario del libro o admin)
  async mostrarFormularioEditar(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.redirect('/libros');
    }
    try {
      const libro = await libroModel.obtenerPorId(id);
      if (!libro) {
        return res.status(404).send('Libro no encontrado.');
      }

      // Si no es admin y no es propietario, denegar
      const user = req.session.user;
      if (user.id_rol !== 1 && user.id !== libro.id_vendedor) {
        return res.status(403).send('Acceso prohibido.');
      }

      const categorias = await categoriaModel.obtenerTodos();
      const formData = {
        titulo: libro.titulo,
        autor: libro.autor,
        descripcion: libro.descripcion,
        precio: libro.precio,
        stock: libro.stock,
        id_categoria: libro.id_categoria
      };

      res.render('libros/edit', { libro, categorias, error: null, formData });
    } catch (err) {
      console.error('Error cargando formulario editar libro:', err);
      res.status(500).send('Error interno.');
    }
  },

  // PROCESAR EDICIÓN DE UN LIBRO (solo vendedor/admin, propietario del libro o admin)
  async procesarEditar(req, res) {
    const id = parseInt(req.params.id, 10);
    const { titulo, autor, descripcion, precio, stock, id_categoria } = req.body;
    const formData = { titulo, autor, descripcion, precio, stock, id_categoria };
    if (isNaN(id)) {
        return res.redirect('/libros');
    }
    try {
      const libro = await libroModel.obtenerPorId(id);
      if (!libro) {
        return res.status(404).send('Libro no encontrado.');
      }

      // Permiso: admin (1) o propietario
      const user = req.session.user;
      if (user.id_rol !== 1 && user.id !== libro.id_vendedor) {
        return res.status(403).send('Acceso prohibido.');
      }

      // Validar campos obligatorios
      if (!titulo || !precio || !stock) {
        const categorias = await categoriaModel.obtenerTodos();
        return res.render('libros/edit', {
          libro,
          categorias,
          error: 'Título, precio y stock son obligatorios.',
          formData
        });
      }

      const precioNum = parseFloat(precio);
      const stockNum = parseInt(stock, 10);
      if (isNaN(precioNum) || isNaN(stockNum)) {
        const categorias = await categoriaModel.obtenerTodos();
        return res.render('libros/edit', {
          libro,
          categorias,
          error: 'Precio y stock deben ser números válidos.',
          formData
        });
      }

      // Actualizar en BD
      await libroModel.actualizarLibro(id, {
        titulo,
        autor,
        descripcion,
        precio: precioNum,
        stock: stockNum,
        id_categoria: id_categoria || null
      });

      res.redirect('/libros/' + id);
    } catch (err) {
      console.error('Error editando libro:', err);
      const categorias = await categoriaModel.obtenerTodos();
      res.render('libros/edit', {
        libro: { id, ...formData },
        categorias,
        error: 'Ocurrió un error al editar el libro.',
        formData
      });
    }
  },

  // ELIMINAR UN LIBRO (solo vendedor/admin, propietario o admin)
  async eliminarLibro(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.redirect('/libros');
    }
    try {
      const libro = await libroModel.obtenerPorId(id);
      if (!libro) {
        return res.status(404).send('Libro no encontrado.');
      }

      // Permiso: admin (1) o propietario
      const user = req.session.user;
      if (user.id_rol !== 1 && user.id !== libro.id_vendedor) {
        return res.status(403).send('Acceso prohibido.');
      }

      await libroModel.eliminarLibro(id);
      // Si el vendedor eliminó, redirigimos a “Mis libros”; si admin, a /libros
      return user.id_rol === 1
        ? res.redirect('/libros')
        : res.redirect('/libros/mis-libros');
    } catch (err) {
      console.error('Error eliminando libro:', err);
      res.status(500).send('Error interno al eliminar.');
    }
  },

  // LISTAR “MIS LIBROS” (solo vendedor)
  async listarMisLibros(req, res) {
    const id_vendedor = req.session.user.id;
    try {
      const libros = await libroModel.obtenerPorVendedor(id_vendedor);
      res.render('libros/mis-libros', { libros });
    } catch (err) {
      console.error('Error listando mis libros:', err);
      res.status(500).send('Error al cargar tus libros.');
    }
  }
};