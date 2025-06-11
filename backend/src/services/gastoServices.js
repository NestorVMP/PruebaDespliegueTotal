const Gasto = require('../models/Gasto');
const { DateTime } = require('luxon');

/*async function crearGastoService(datosGasto) {
  const gasto = new Gasto(datosGasto);
  return await gasto.save();
}*/
async function crearGastoService(datosGasto) {
  const hoy = DateTime.now().startOf('day');
  //const fechaGasto = DateTime.fromISO(datosGasto.fecha).startOf('day');
  const fechaGasto = DateTime.fromJSDate(new Date(datosGasto.fecha)).startOf('day');


  const datos = { ...datosGasto };
  if (!datos.idOrigen) {
    datos.idOrigen = null;
  }
  const tiposValidos = ['unico', 'suscripcion', 'consumo'];
  if (!datos.tipo || !tiposValidos.includes(datos.tipo)) {
    datos.tipo = 'unico';
  }


  if (typeof datos.anticipado === 'undefined') {
    datos.anticipado = fechaGasto > hoy;
  }

  const gasto = new Gasto(datos);
  return await gasto.save();
}

async function listarGastosService(usuarioId) {
  return await Gasto.find({ usuario: usuarioId }).sort({ createdAt: -1 });
}
async function eliminarGastoService(gastoId, usuarioId) {
  const result = await Gasto.deleteOne({ _id: gastoId, usuario: usuarioId });
  if (result.deletedCount === 0) throw new Error('No autorizado o gasto no encontrado');
}

async function editarGastoService(gastoId, nuevosDatos, usuarioId) {
  const gasto = await Gasto.findOneAndUpdate(
    { _id: gastoId, usuario: usuarioId },
    nuevosDatos,
    { new: true }
  );
  if (!gasto) throw new Error('No autorizado o gasto no encontrado');
  return gasto;
}

async function generarFacturasDeGastosService(usuarioId, zonaHoraria = 'UTC') {
  const hoy = DateTime.now().setZone(zonaHoraria).startOf('day').toJSDate();

  // Seleccionar solo gastos únicos anticipados que ya deberían haberse hecho efectivos
  await Gasto.updateMany(
    {
      usuario: usuarioId,
      tipo: 'unico',
      anticipado: true,
      fecha: { $lte: hoy }
    },
    { $set: { anticipado: false } }
  );
}

module.exports = { crearGastoService, listarGastosService, eliminarGastoService, editarGastoService, generarFacturasDeGastosService };
