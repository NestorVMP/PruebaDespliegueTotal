require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Gasto = require('../models/Gasto');
const { agruparGastosMensuales, generarGrafico } = require('../utils/graficoGastos');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function obtenerCategoriaMayor(d) {
  const categorias = [
    { tipo: 'suscripciones', monto: d.suscripcion },
    { tipo: 'consumos', monto: d.consumo },
    { tipo: 'gastos únicos', monto: d.unico },
  ];
  return categorias.sort((a, b) => b.monto - a.monto)[0].tipo;
}

async function enviarCorreos() {
  await connectDB();
  const usuarios = await User.find();
  console.log(`👥 Usuarios encontrados: ${usuarios.length}`);

  for (const usuario of usuarios) {
    console.log(`📧 Procesando usuario: ${usuario.email}`);

    const gastos = await Gasto.find({ usuario: usuario._id });
    console.log(`📊 Gastos encontrados: ${gastos.length}`);

    if (!gastos.length) {
      console.log(`⚠️ Sin gastos para ${usuario.email}, saltando...`);
      continue;
    }

    const agrupados = agruparGastosMensuales(gastos);
    console.log('📆 Gastos agrupados por mes:', agrupados.map((g) => g.mes));

    const today = new Date();
    const mesAnteriorDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const mesClave = `${mesAnteriorDate.getFullYear()}-${(mesAnteriorDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    console.log(`🔎 Buscando datos del mes: ${mesClave}`);

    const datosMesActual = agrupados.find((d) => d.mes === mesClave);
    if (!datosMesActual) {
      console.log(`❌ No hay datos para ${mesClave} para ${usuario.email}, saltando...`);
      continue;
    }

    const resumenTexto = `En ${mesClave} gastaste un total de ${datosMesActual.total.toFixed(2)}€:
    - Suscripciones: ${datosMesActual.suscripcion.toFixed(2)}€
    - Consumo: ${datosMesActual.consumo.toFixed(2)}€
    - Gastos únicos: ${datosMesActual.unico.toFixed(2)}€

    💡 El mayor gasto fue en ${obtenerCategoriaMayor(datosMesActual)}.
    `;

    console.log(`✉️ Enviando correo a ${usuario.email} con resumen:\n${resumenTexto}`);

    const grafico = await generarGrafico([datosMesActual]);

    await transporter.sendMail({
      from: `"GastoTrack" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: `Resumen de gastos: ${mesClave}`,
      html: `
        <h3>Hola ${usuario.name} 👋</h3>
        <p>${resumenTexto.replace(/\n/g, '<br>')}</p>
        <p>A continuación te mostramos tu gráfico de gastos del mes:</p>
        <img src="cid:graficoGastos" />
      `,
      attachments: [
        {
          filename: 'grafico.png',
          content: grafico,
          cid: 'graficoGastos',
        },
      ],
    });

    console.log(`✅ Correo enviado a ${usuario.email}`);
  }

  console.log('✅✅ Todos los correos procesados');
}

module.exports = { enviarCorreos };

if (require.main === module) {
  enviarCorreos(); // Para pruebas manuales
}
