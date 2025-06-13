const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment');

const width = 600; // px
const height = 400;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

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

async function generarGrafico(mensualData) {
  const labels = mensualData.map(d =>
    moment(`${d.mes}-01`).format('MMM YY')
  );
  const dataSuscripcion = mensualData.map(d => d.suscripcion);
  const dataConsumo = mensualData.map(d => d.consumo);
  const dataUnico = mensualData.map(d => d.unico);

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Suscripciones', data: dataSuscripcion, backgroundColor: '#4e73df' },
        { label: 'Consumo', data: dataConsumo, backgroundColor: '#1cc88a' },
        { label: 'Gastos Únicos', data: dataUnico, backgroundColor: '#e74a3b' },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Gastos Mensuales por Tipo',
        },
      },
      responsive: false,
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(config);
}

module.exports = {
  agruparGastosMensuales,
  generarGrafico,
};
