// src/utils/auth.js

// Verifica que haya un usuario autenticado en sesión
function asegurarAutenticado(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Verifica que el rol del usuario sea uno de los permitidos
// rolesPermitidos: array de id_rol (p. ej. [1, 2] para admin y vendedor)
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/login');
    }
    if (!rolesPermitidos.includes(user.id_rol)) {
      return res.status(403).send('Acceso prohibido');
    }
    next();
  };
}

module.exports = {
  asegurarAutenticado,
  verificarRol
};