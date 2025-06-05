#!/bin/bash
set -e

# Script para inicializar el proyecto de la librería:
# - Inicializa npm y instala dependencias
# - Crea la estructura de carpetas y archivos vacíos

# 1. Inicializar npm (si package.json no existe)
if [ ! -f package.json ]; then
  echo "Inicializando npm..."
  npm init -y
else
  echo "package.json ya existe. Omisión de npm init."
fi

# 2. Instalar dependencias
echo "Instalando dependencias..."
npm install express express-session ejs bcrypt mysql2 dotenv nodemailer

# 3. Crear estructura de directorios
echo "Creando carpetas..."

mkdir -p src/routes
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/views/layouts
mkdir -p src/views/auth
mkdir -p src/views/libros
mkdir -p src/views/compras
mkdir -p src/views/admin
mkdir -p src/views/stats
mkdir -p src/public
mkdir -p src/utils
mkdir -p migrations

# 4. Crear archivos vacíos en la raíz del proyecto
touch .env
touch Dockerfile
touch docker-compose.yml
touch README.md

# 5. Crear archivos vacíos en /src
touch src/app.js

# 5.1 Rutas
touch src/routes/auth.js
touch src/routes/libros.js
touch src/routes/compras.js
touch src/routes/admin.js
touch src/routes/stats.js

# 5.2 Controladores
touch src/controllers/authController.js
touch src/controllers/librosController.js
touch src/controllers/comprasController.js
touch src/controllers/adminController.js
touch src/controllers/statsController.js

# 5.3 Modelos
touch src/models/db.js
touch src/models/usuario.js
touch src/models/libro.js
touch src/models/venta.js

# 5.4 Vistas EJS
touch src/views/layouts/main.ejs

# Vistas de autenticación
touch src/views/auth/login.ejs
touch src/views/auth/register.ejs

# Vistas de libros
touch src/views/libros/index.ejs
touch src/views/libros/detalle.ejs
touch src/views/libros/create.ejs
touch src/views/libros/edit.ejs
touch src/views/libros/mis-libros.ejs

# Vistas de compras
touch src/views/compras/carrito.ejs
touch src/views/compras/confirmacion.ejs

# Vistas de administración
touch src/views/admin/usuarios.ejs
touch src/views/admin/ventas.ejs

# Vista de estadísticas
touch src/views/stats.ejs

# 5.5 Utilidades
touch src/utils/mailer.js
touch src/utils/auth.js

# 5.6 Migraciones
touch migrations/initial.sql

echo "Estructura de carpetas y archivos creada correctamente."
echo "¡Todo listo para comenzar a desarrollar!"