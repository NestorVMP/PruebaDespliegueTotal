const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { generarGrafico } = require('../utils/chartGenerator');

const tipoEmoji = {
  suscripcion: 'suscripciones 🔵',
  consumo: 'consumos 🟣',
  unico: 'gastos únicos 🟢'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send', async (req, res) => {
  const { to, subject, gastos } = req.body;
  console.log('gastos',gastos);
  if (!gastos || typeof gastos !== 'object') {
    return res.status(400).json({ error: 'Datos de gastos inválidos o faltantes' });
  }

  const fechaBase = `${gastos.mes}-01`;
  const gastosArray = [];

  for (const tipo of ['suscripcion', 'consumo', 'unico']) {
    const monto = gastos[tipo];
    if (monto && monto > 0) {
      gastosArray.push({
        fecha: fechaBase,
        tipo,
        monto
      });
    }
  }
  console.log('gastosArray:',gastosArray);
  try {
    const { buffer, mes, tipo, cantidad } = await generarGrafico(gastosArray);

    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <h2>Hola 👋</h2>
        <p>En el mes de <strong>${mes}</strong> lo que más gastaste fue en <strong>${tipoEmoji[tipo]}</strong> con <strong>${cantidad}€</strong>.</p>
        <img src="cid:graficoGasto" style="max-width:100%;border-radius:8px;margin-top:10px;" />
      `,
      attachments: [
        {
          filename: 'grafico.png',
          content: buffer,
          cid: 'graficoGasto'
        }
      ]
    });

    res.status(200).json({ message: 'Correo con imagen enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: error.message || 'Error al enviar correo con gráfico' });
  }
});

module.exports = router;
