const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 800;
const height = 400;

const backgroundColors = {
  suscripcion: 'rgba(54, 162, 235, 0.6)', // 🔵
  consumo: 'rgba(153, 102, 255, 0.6)',     // 🟣
  unico: 'rgba(75, 192, 192, 0.6)'         // 🟢
};

function getMesKey(fechaString) {
  const fecha = new Date(fechaString);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

function getNombreMes(fechaString) {
  const fecha = new Date(fechaString);
  const nombreMeses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${nombreMeses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

function agruparGastosPorMesYTipo(gastos) {
  const agrupado = {};

  gastos.forEach(g => {
    const mes = getMesKey(g.fecha);
    if (!agrupado[mes]) agrupado[mes] = { suscripcion: 0, consumo: 0, unico: 0 };
    agrupado[mes][g.tipo] += g.monto;
  });

  console.log("📦 Gastos agrupados en backend:", agrupado);
  return agrupado;
}

function tipoMayorDelMes(gastosMes) {
  return Object.entries(gastosMes).reduce((a, b) => b[1] > a[1] ? b : a);
}

async function generarGrafico(gastos) {
  console.log('entro 2');
  const canvas = new ChartJSNodeCanvas({ width, height });

  const agrupado = agruparGastosPorMesYTipo(gastos);

  const ahora = new Date();
  const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  const datosMes = agrupado[mesActual];

  console.log("📆 Mes actual:", mesActual);
  console.log("📊 Datos del mes actual en backend:", datosMes);

  if (!datosMes) {
    throw new Error(`No hay datos para el mes actual (${mesActual})`);
  }

  const datasets = Object.entries(datosMes).map(([tipo, cantidad]) => ({
    label: tipo,
    data: [cantidad],
    backgroundColor: backgroundColors[tipo]
  }));

  const config = {
    type: 'bar',
    data: {
      labels: [mesActual],
      datasets
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: { size: 14 }
          }
        }
      },
      responsive: false
    }
  };

  const buffer = await canvas.renderToBuffer(config);
  const [tipo, cantidad] = tipoMayorDelMes(datosMes);

  return {
    buffer,
    mes: getNombreMes(`${mesActual}-01`),
    tipo,
    cantidad: cantidad.toFixed(2)
  };
}

module.exports = { generarGrafico };
