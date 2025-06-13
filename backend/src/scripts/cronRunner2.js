require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCorreos() {
  await connectDB();
  const usuarios = await User.find();

  for (const usuario of usuarios) {
    const html = `
      <h3>Hola ${usuario.name} 👋</h3>
      <p>Este es tu resumen básico. Email: ${usuario.email}, rol: ${usuario.role}.</p>
    `;

    await transporter.sendMail({
      from: `"GastoTrack" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: 'Resumen automático (vía cron)',
      html,
    });

    console.log(`Correo enviado a ${usuario.email}`);
  }

  console.log('⏱️ Job completado');
}

// Programar tarea
//cron.schedule('*/5 * * * *', () => {
  //console.log('⏰ Ejecutando job cada 5 minutos...');
  //enviarCorreos();
//});

cron.schedule('* * * * *', () => {
  console.log('⏰ Ejecutando job cada minuto...');
  enviarCorreos();
});
//enviarCorreos(); //para hacerlo al instante y luego empiece el contador

//node src/scripts/cronRunner.js //ejecutar codigo