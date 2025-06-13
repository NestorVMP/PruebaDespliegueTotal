 const db = require('../models'); // o el acceso directo a tu DB
const { generarGrafico } = require('../utils/chartGenerator');
const nodemailer = require('nodemailer');

async function agruparGastosMensuales(gastos) {
  const agrupados = {};
  gastos.forEach((g) => {
    const fecha = new Date(g.fecha);
    const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!agrupados[mes]) agrupados[mes] = { mes, suscripcion: 0, consumo: 0, unico: 0 };
    agrupados[mes][g.tipo] += g.monto;
  });
  return Object.values(agrupados).map((d) => ({ ...d, total: d.suscripcion + d.consumo + d.unico }));
}

function generarResumenTexto(mensual) {
  const { mes, suscripcion, consumo, unico, total } = mensual;
  const tipos = [
    { tipo: 'suscripciones', monto: suscripcion },
    { tipo: 'consumos', monto: consumo },
    { tipo: 'gastos únicos', monto: unico },
  ];
  const partes = tipos.filter((g) => g.monto > 0).sort((a, b) => b.monto - a.monto).map((g) => `${g.tipo} con ${g.monto.toFixed(2)}€`);
  const listaPartes = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} y ${partes.slice(-1)}` : partes[0];
  const mesFormateado = new Date(`${mes}-01`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return `💬 En ${mesFormateado} gastaste ${total.toFixed(2)}€, siendo ${listaPartes} tus mayores gastos.`;
}

async function enviarResumenes() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const usuarios = await db.Usuario.findAll(); // Ajusta según tu ORM

  for (const usuario of usuarios) {
    const gastos = await db.Gasto.findAll({ where: { usuarioId: usuario.id } });

    if (!gastos.length) continue;

    const agrupados = await agruparGastosMensuales(gastos);

    // Obtener mes anterior
    const hoy = new Date();
    hoy.setMonth(hoy.getMonth() - 1);
    const mesAnterior = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}`;
    const datosMes = agrupados.find((g) => g.mes === mesAnterior);
    if (!datosMes) continue;

    const resumenTexto = generarResumenTexto(datosMes);

    const gastosArray = ['suscripcion', 'consumo', 'unico']
      .filter((tipo) => datosMes[tipo] > 0)
      .map((tipo) => ({ fecha: `${datosMes.mes}-01`, tipo, monto: datosMes[tipo] }));

    const { buffer, mes, tipo, cantidad } = await generarGrafico(gastosArray);

    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: resumenTexto,
      html: `
        <h2>Hola ${usuario.nombre || ''} 👋</h2>
        <p>En <strong>${mes}</strong> lo que más gastaste fue en <strong>${tipo}</strong> con <strong>${cantidad}€</strong>.</p>
        <img src="cid:graficoGasto" />
      `,
      attachments: [{
        filename: 'grafico.png',
        content: buffer,
        cid: 'graficoGasto',
      }],
    });

    console.log(`✅ Correo enviado a ${usuario.email}`);
  }
}

enviarResumenes().catch((err) => {
  console.error('❌ Error al enviar resúmenes mensuales:', err);
});
