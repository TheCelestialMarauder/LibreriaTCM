# LibreríaTCM

Aplicación web de librería básica desarrollada con Node.js, Express y MySQL. Hasta ahora incluye:

- Estructura de carpetas y ficheros base.
- Script SQL de migración para crear la base de datos y tablas ([migrations/initial.sql](./migrations/initial.sql)).
- Configuración de variables de entorno (`.env`).
- Módulo de envío de correos (`src/utils/mailer.js`) usando Nodemailer y Gmail SMTP (App Password).
- Script de prueba de correo (`src/utils/test-email.js`).
- Esqueleto de `app.js` con Express, dotenv, EJS y sesiones.
- Carpetas vacías en `src/routes`, `src/controllers`, `src/models` y `src/views` para implementar login, registro, CRUD, etc.

---

## Índice

1. [Requisitos](#requisitos)
2. [Instalación rápida](#instalación-rápida)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Variables de entorno (`.env`)](#variables-de-entorno-env)
5. [Migraciones de base de datos](#migraciones-de-base-de-datos)
6. [Envío de correos](#envío-de-correos)
7. [Arrancar la aplicación](#arrancar-la-aplicación)
8. [Próximos pasos](#próximos-pasos)

---

## Requisitos

- Node.js (v16+), npm
- MySQL (v5.7+ o v8+)
- (Opcional) Docker/Docker Compose
- Cuenta de Gmail con 2FA y App Password generada (16 caracteres, sin espacios)

---

## Instalación rápida

1. Clonar repositorio y entrar en la carpeta:
   ```bash
   git clone https://github.com/tu-usuario/LibreriaTCM.git
   cd LibreriaTCM
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear o editar `.env` (ver sección siguiente).
4. Ejecutar migraciones en MySQL:
   ```bash
   mysql -u <usuario> -p < migrations/initial.sql
   ```
   o, si usas Docker Compose:
   ```bash
   docker-compose up -d db
   docker-compose exec db mysql -u root -p${DB_PASS} < /app/migrations/initial.sql
   ```

---

## Estructura del proyecto

```
LibreriaTCM/
├─ .env                   ← Variables de entorno (no subir)
├─ migrations/
│   └─ initial.sql        ← Script SQL para crear tablas
├─ src/
│   ├─ app.js             ← Configuración de Express
│   ├─ routes/            ← Rutas (vacías)
│   ├─ controllers/       ← Controladores (vacíos)
│   ├─ models/            ← Modelos (vacíos)
│   ├─ utils/             ← Utilidades (mailer, test-email, auth middleware)
│   ├─ views/             ← Vistas EJS (vacías)
│   └─ public/            ← Archivos estáticos (vacío)
├─ Dockerfile             ← (Pendiente)
├─ docker-compose.yml     ← (Pendiente)
└─ README.md              ← Este archivo
```

---

## Variables de entorno (`.env`)

```dotenv
PORT=3000

DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASS=tu_contraseña_mysql
DB_NAME=libreria

SESSION_SECRET=clave_super_segura

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_cuenta@gmail.com
MAIL_PASS=tu_app_password_sin_espacios
```

> • **DB\_\***: credenciales MySQL  
> • **SESSION_SECRET**: clave para firmar cookies de sesión  
> • **MAIL\_\***: configuración SMTP de Gmail (usar App Password)

---

## Migraciones de base de datos

El script completo está en [migrations/initial.sql](./migrations/initial.sql).  
Crea las tablas necesarias:

- **roles**
- **categorias**
- **usuarios**
- **libros**
- **ventas**
- (Opcional) **sesiones**

Para ejecutarlo, ver “Instalación rápida”.

---

## Envío de correos

- **`src/utils/mailer.js`**: configurado con Nodemailer y Gmail SMTP.
- **`src/utils/test-email.js`**: ejemplo de uso para probar envío de correos.

Ejecuta desde la raíz:

```bash
node src/utils/test-email.js
```

Revisa consola y bandeja de entrada para verificar que llega el correo de prueba.

---

## Arrancar la aplicación

Una vez instalado y migrado, inicia el servidor:

```bash
node src/app.js
```

o, si definiste en `package.json`:

```bash
npm start
```

Deberías ver:

```
Servidor escuchando en http://localhost:3000
```

Al abrir esa URL sin rutas implementadas aparecerá “Cannot GET /”, pero no errores fatales.
