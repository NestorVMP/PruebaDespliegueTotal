// src/scripts/sendUserSummary.js
require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const connectDB = require('../config/database');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta

// Configurar transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función principal
const enviarResumenUsuarios = async () => {
  try {
    await connectDB();

    const usuarios = await User.find();
    console.log(`🔍 ${usuarios.length} usuarios encontrados`);

    for (const usuario of usuarios) {
      const { name, email, role, preferredChart } = usuario;

      const mensaje = `
        <h3>Hola ${name} 👋</h3>
        <p>Este es un resumen básico de tus datos en la aplicación:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Rol:</strong> ${role}</li>
          <li><strong>Gráfico preferido:</strong> ${preferredChart}</li>
        </ul>
        <p>Gracias por usar nuestra aplicación 🙌</p>
      `;

      await transporter.sendMail({
        from: `"GastoTrack" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🧾 Resumen básico de tus datos en GastoTrack',
        html: mensaje,
      });

      console.log(`✅ Email enviado a ${email}`);
    }

    console.log('🎉 Todos los correos han sido enviados');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en el envío de correos:', err);
    process.exit(1);
  }
};

enviarResumenUsuarios();
