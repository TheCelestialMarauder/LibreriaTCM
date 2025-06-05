// src/utils/test-email.js
require('dotenv').config();
const { sendMail } = require('./mailer'); 

async function main() {
  try {
    await sendMail({
      to: '0.zawar.k.0@gmail.com',
      subject: 'Correo de prueba desde Librería',
      html: '<h1>¡Hola!</h1><p>Este es un correo de prueba enviado desde tu app de librería.</p>'
    });
    console.log('¡Correo de prueba enviado correctamente!');
    process.exit(0);
  } catch (err) {
    console.error('Falló el envío de prueba:', err);
    process.exit(1);
  }
}

main();