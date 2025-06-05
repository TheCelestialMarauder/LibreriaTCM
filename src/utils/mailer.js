// src/utils/mailer.js
const nodemailer = require('nodemailer');

// Leemos variables de entorno
const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS
} = process.env;

// Configuramos el transporter de Nodemailer
// - host: smtp.gmail.com
// - port: 587 (STARTTLS)
// - secure: false para que use STARTTLS en el 587
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: parseInt(MAIL_PORT, 10),
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

// Función para enviar correo
async function sendMail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Mi Librería" <${MAIL_USER}>`, // Remitente
      to,
      subject,
      html
    });
    console.log('Correo enviado:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error enviando correo:', err);
    throw err;
  }
}

module.exports = { sendMail };