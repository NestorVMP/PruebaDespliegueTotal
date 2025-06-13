require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Gasto = require('../models/Gasto'); // tu modelo
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

  for (const usuario of usuarios) {
        const gastos = await Gasto.find({ usuario: usuario._id });

    if (!gastos.length) continue;

    const agrupados = agruparGastosMensuales(gastos);

    const today = new Date();
    const mesActual = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const datosMesActual = agrupados.find((d) => d.mes === mesActual);
    if (!datosMesActual) continue;

    const resumenTexto = `En ${mesActual} gastaste un total de ${datosMesActual.total.toFixed(2)}€:
                        - Suscripciones: ${datosMesActual.suscripcion.toFixed(2)}€
                        - Consumo: ${datosMesActual.consumo.toFixed(2)}€
                        - Gastos únicos: ${datosMesActual.unico.toFixed(2)}€

                        💡 El mayor gasto fue en ${obtenerCategoriaMayor(datosMesActual)}.
                        `;


    //const grafico = await generarGrafico(agrupados);
    const grafico = await generarGrafico([datosMesActual]);

    await transporter.sendMail({
        from: `"GastoTrack" <${process.env.EMAIL_USER}>`,
        to: usuario.email,
        subject: `Resumen de gastos: ${mesActual}`,
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

    console.log(`📨 Correo con gráfico enviado a ${usuario.email}`);
  }
  console.log('⏱️ Job completado');
}

module.exports = { enviarCorreos };

if (require.main === module) {
  enviarCorreos(); // o cron.schedule(...) si aún quieres usarlo localmente
}

/*cron.schedule('* * * * *', () => {
  console.log('⏰ Ejecutando job cada minuto...');
  enviarCorreos();
});*/
//enviarCorreos(); //para hacerlo al instante y luego empiece el contador

//node src/scripts/cronRunner.js //ejecutar codigo