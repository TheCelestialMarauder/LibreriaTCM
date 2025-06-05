// src/controllers/comprasController.js
const libroModel = require('../models/libro');
const ventaModel = require('../models/venta');

module.exports = {
  /**
   * Agrega un libro al carrito en sesión.
   * Si ya existe, incrementa la cantidad.
   */
  async agregarAlCarrito(req, res) {
    // ID de libro desde params
    const idLibro = parseInt(req.params.id, 10);
    if (isNaN(idLibro)) {
      return res.redirect('/libros');
    }

    try {
      // 1) Obtener datos del libro para tener título y precio unitario
      const libro = await libroModel.obtenerPorId(idLibro);
      if (!libro) {
        return res.redirect('/libros');
      }

      // 2) Inicializar carrito en sesión si no existe
      if (!req.session.carrito) {
        req.session.carrito = {};
      }
      const carrito = req.session.carrito;

      // 3) Si ya tenía ese libro, incrementamos cantidad; sino, lo insertamos con cantidad = 1
      if (carrito[idLibro]) {
        carrito[idLibro].cantidad += 1;
        carrito[idLibro].subtotal = parseFloat(carrito[idLibro].precio_unitario) * carrito[idLibro].cantidad;
      } else {
        carrito[idLibro] = {
          id: idLibro,
          titulo: libro.titulo,
          precio_unitario: parseFloat(libro.precio),
          cantidad: 1,
          subtotal: parseFloat(libro.precio) * 1
        };
      }

      // 4) Guardar la sesión y redirigir a carrito
      req.session.carrito = carrito;
      res.redirect('/compras/carrito');
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      res.status(500).send('Ocurrió un error al agregar el libro al carrito.');
    }
  },

  /**
   * Muestra los ítems del carrito (almacenados en sesión).
   */
  verCarrito(req, res) {
    const carrito = req.session.carrito || {};
    // Convertimos el objeto en array para iterar en la vista
    const items = Object.values(carrito);

    // Calculamos total general
    const totalGeneral = items.reduce((acc, item) => acc + item.subtotal, 0);

    res.render('compras/carrito', { items, totalGeneral });
  },

  /**
   * Elimina un ítem del carrito (o reduce en uno la cantidad).
   * @param /compras/remove/:id
   */
  quitarDelCarrito(req, res) {
    const idLibro = parseInt(req.params.id, 10);
    if (isNaN(idLibro) || !req.session.carrito) {
      return res.redirect('/compras/carrito');
    }
    const carrito = req.session.carrito;

    if (carrito[idLibro]) {
      // Si cantidad > 1, restamos 1; si es 1, eliminamos la clave
      if (carrito[idLibro].cantidad > 1) {
        carrito[idLibro].cantidad -= 1;
        carrito[idLibro].subtotal = carrito[idLibro].precio_unitario * carrito[idLibro].cantidad;
      } else {
        delete carrito[idLibro];
      }
    }

    req.session.carrito = carrito;
    res.redirect('/compras/carrito');
  },

  /**
   * Procesa la compra: inserta filas en ventas y actualiza stock.
   */
  async procesarCompra(req, res) {
    // 1) Verificamos que haya usuario logueado
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const idComprador = req.session.user.id;

    // 2) Revisar si hay ítems en el carrito
    const carrito = req.session.carrito || {};
    const items = Object.values(carrito);
    if (items.length === 0) {
      return res.redirect('/compras/carrito');
    }

    try {
      // 3) Para cada ítem, intentar crear una fila en ventas y disminuir stock
      for (let item of items) {
        const { id, cantidad, precio_unitario } = item;

        // 3a) Disminuir stock; si no hay suficiente, abortamos
        const afectadas = await libroModel.disminuirStock(id, cantidad);
        if (afectadas === 0) {
          // Stock insuficiente: limpiar carrito y mostrar error
          req.session.carrito = {};
          return res.send(`No hay stock suficiente para "${item.titulo}". La compra no se pudo completar.`);
        }

        // 3b) Calcular total y crear la venta (sin precio_unitario)
        const totalVenta = parseFloat((precio_unitario * cantidad).toFixed(2));
        await ventaModel.crearVenta({
          id_comprador: idComprador,
          id_libro: id,
          cantidad,
          total: totalVenta
        });
      }

      // 4) Si todo sale bien, vaciar carrito y redirigir a confirmación
      req.session.carrito = {};
      res.redirect('/compras/confirmacion');
    } catch (err) {
      console.error('Error procesando compra:', err);
      res.status(500).send('Ocurrió un error al procesar la compra.');
    }
  },

  /**
   * Muestra página de confirmación tras compra exitosa.
   */
  confirmacionCompra(req, res) {
    res.render('compras/confirmacion');
  }
};