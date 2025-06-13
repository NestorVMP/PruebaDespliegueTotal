import axios from 'axios';
import { useUser } from '../context/UserContext';

// 1. Agrupar gastos por mes
function agruparGastosMensuales(gastos) {
  const agrupados = {};

  gastos.forEach((g) => {
    const fecha = new Date(g.fecha);
    const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    if (!agrupados[mes]) {
      agrupados[mes] = { mes, suscripcion: 0, consumo: 0, unico: 0 };
    }

    agrupados[mes][g.tipo] += g.monto;
  });

  return Object.values(agrupados)
    .map((d) => ({
      ...d,
      total: d.suscripcion + d.consumo + d.unico,
    }))
    .sort((a, b) => new Date(a.mes) - new Date(b.mes));
}

// 2. Obtener resumen textual para el email
function generarResumenTexto(mensual) {
  const { mes, suscripcion, consumo, unico, total } = mensual;

  const tipos = [
    { tipo: 'suscripciones', monto: suscripcion },
    { tipo: 'consumos', monto: consumo },
    { tipo: 'gastos únicos', monto: unico },
  ];

  const partes = tipos
    .filter((g) => g.monto > 0)
    .sort((a, b) => b.monto - a.monto)
    .map((g) => `${g.tipo} con ${g.monto.toFixed(2)}€`);

  const listaPartes = partes.length > 1
    ? `${partes.slice(0, -1).join(', ')} y ${partes.slice(-1)}`
    : partes[0];

  const mesFormateado = new Date(`${mes}-01`).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return `💬 En ${mesFormateado} gastaste ${total.toFixed(2)}€, siendo ${listaPartes} tus mayores gastos.`;
}

export async function ejecutarResumenMensual(userData) {
  if (!userData || !userData.email) {
    console.error('❌ No se encontró el email del usuario');
    alert('No se pudo enviar el resumen porque falta el email del usuario.');
    return;
  }

  try {
    console.log('📡 Solicitando gastos del usuario...');

    //const response = await axios.get('http://localhost:3000/gasto/list', {
    const response = await axios.get('/gasto/list', {
      withCredentials: true,
    });

    const gastos = response.data;
    console.log(`📦 Gastos recibidos (${gastos.length}):`, gastos);

    if (!gastos || gastos.length === 0) {
      console.warn('⚠️ No se encontraron gastos para el usuario.');
      alert('No se encontraron gastos para enviar el resumen.');
      return;
    }

    const agrupados = agruparGastosMensuales(gastos);
    console.log('📊 Gastos agrupados por mes:', agrupados);

    const today = new Date();
    const mesActual = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const datosMesActual = agrupados.find((d) => d.mes === mesActual);

    if (!datosMesActual) {
      console.warn(`⚠️ No hay datos para el mes actual (${mesActual})`);
      alert(`No se encontraron gastos registrados para ${mesActual}.`);
      return;
    }

    console.log('📄 Datos del mes actual:', datosMesActual);

    const resumenTexto = generarResumenTexto(datosMesActual);
    console.log('📝 Resumen generado:', resumenTexto);

    //const envio = await axios.post( 'http://localhost:3000/email/send', {
    const envio = await axios.post( '/email/send', {
        to: userData.email,
        //to: 'nestorino_93@hotmail.es', 
        subject: resumenTexto,
        gastos: datosMesActual,
      },
      { withCredentials: true }
    );

    console.log('✅ Resumen enviado correctamente:', envio.data);
    alert('Resumen mensual enviado correctamente.');
  } catch (err) {
    console.error('❌ Error al ejecutar resumen mensual:', err);
    alert('Ocurrió un error al enviar el resumen mensual.');
  }
}
