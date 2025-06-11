const Suscripcion = require('../models/Suscripcion');
const { crearGastoService } = require('./gastoServices');
const Gasto = require('../models/Gasto');
const { DateTime } = require('luxon');

async function crearSuscripcionService(datosSuscripcion) {
    try {
      if (!datosSuscripcion.proximoPago) {
        datosSuscripcion.proximoPago = datosSuscripcion.fechaInicio;
      }

      const suscripcion = new Suscripcion(datosSuscripcion);
      const nuevaSuscripcion = await suscripcion.save();

      const hoy = new Date();
      const fechaGasto = new Date(datosSuscripcion.proximoPago);
      const esAnticipado = fechaGasto > hoy;

      await crearGastoService({
        nombre: datosSuscripcion.nombre,
        monto: datosSuscripcion.monto,
        fecha: datosSuscripcion.proximoPago,
        categoria: datosSuscripcion.categoria,
        usuario: datosSuscripcion.usuario,
        idOrigen: datosSuscripcion._id,
        tipo: 'suscripcion',
        anticipado: esAnticipado,
        idOrigen: nuevaSuscripcion._id
      });

      return nuevaSuscripcion;

    } catch (err) {
        console.error('Error al crear el suscripcion:', err);
        throw err;
    }
}

async function listarSuscripcionService(usuarioId) {
  return await Suscripcion.find({ usuario: usuarioId }).sort({ createdAt: -1 });
}

async function eliminarSuscripcionService(suscripcionId, usuarioId) {
  const result = await Suscripcion.deleteOne({ _id: suscripcionId, usuario: usuarioId });
  if (result.deletedCount === 0) throw new Error('No autorizado o suscripcion no encontrado');
}

async function editarSuscripcionService(suscripcionId, nuevosDatos, usuarioId) {
  const suscripcion = await Suscripcion.findOneAndUpdate(
    { _id: suscripcionId, usuario: usuarioId },
    nuevosDatos,
    { new: true }
  );
  
  if (!suscripcion) throw new Error('No autorizado o suscripcion no encontrado');
  return suscripcion;
}

async function eliminarFacturaAnticipada(suscripcionId, usuarioId) {
  await Gasto.deleteOne({
    usuario: usuarioId,
    idOrigen: suscripcionId,
    anticipado: true
  });
}

async function calcularProximoPago({ fechaInicio, frecuencia }) {
  const fecha = DateTime.fromJSDate(fechaInicio);

  if (!frecuencia || !frecuencia.frecuenciaNumero || !frecuencia.frecuenciaUnidad) {
    throw new Error('Frecuencia inválida');
  }

  const cantidad = parseInt(frecuencia.frecuenciaNumero);
  const unidad = frecuencia.frecuenciaUnidad.toLowerCase();

  const unidadesValidas = ['dias', 'semanas', 'meses', 'años'];
  if (!unidadesValidas.includes(unidad)) {
    throw new Error(`Unidad de frecuencia no válida: ${unidad}`);
  }

  const luxonMap = {
    dias: 'days',
    semanas: 'weeks',
    meses: 'months',
    años: 'years'
  };

  return fecha.plus({ [luxonMap[unidad]]: cantidad }).toJSDate();
}


async function generarFacturasDeSuscripcionesService(usuarioId, zonaHoraria) {
  const suscripciones = await Suscripcion.find({ usuario: usuarioId, activa: true });
  const hoy = DateTime.now().setZone(zonaHoraria).startOf('day');

  for (const suscripcion of suscripciones) {
    let { proximoPago, frecuencia } = suscripcion;

    await Gasto.updateMany(
      {
        usuario: usuarioId,
        idOrigen: suscripcion._id,
        anticipado: true,
        fecha: { $lte: hoy }
      },
      { $set: { anticipado: false } }
    );

    let proximoPagoDateTime = DateTime.fromJSDate(proximoPago).startOf('day');

    while (proximoPagoDateTime <= hoy) {
      const yaExiste = await Gasto.findOne({
        usuario: usuarioId,
        idOrigen: suscripcion._id,
        fecha: {
          $gte: proximoPagoDateTime.startOf('day').toJSDate(),
          $lte: proximoPagoDateTime.endOf('day').toJSDate()
        }
      });

      const proximoPagoJS = proximoPagoDateTime.toJSDate();

      if (!yaExiste) {
        await Gasto.create({
          usuario: usuarioId,
          nombre: suscripcion.nombre,
          monto: suscripcion.monto,
          fecha: proximoPagoJS,
          categoria: suscripcion.categoria,
          tipo: 'suscripcion',
          anticipado: false,
          idOrigen: suscripcion._id
        });
      }

      proximoPago = calcularProximoPago({ fechaInicio: proximoPagoJS, frecuencia }); // ✅ CORREGIDO
      proximoPagoDateTime = DateTime.fromJSDate(proximoPago).startOf('day'); // ✅ Mantener el bucle con Luxon
    }

    const yaExisteAnticipada = await Gasto.findOne({
      usuario: usuarioId,
      idOrigen: suscripcion._id,
      anticipado: true,
      fecha: {
        $gte: DateTime.fromJSDate(proximoPago).startOf('month').toJSDate(),
        $lte: DateTime.fromJSDate(proximoPago).endOf('month').toJSDate()
      }
    });

    if (!yaExisteAnticipada) {
      await Gasto.create({
        usuario: usuarioId,
        nombre: suscripcion.nombre,
        monto: suscripcion.monto,
        fecha: proximoPago,
        categoria: suscripcion.categoria,
        tipo: 'suscripcion',
        anticipado: true,
        idOrigen: suscripcion._id
      });
    }

    suscripcion.proximoPago = proximoPago;
    await suscripcion.save();
  }
}

async function actualizarFacturaAnticipadaDeSuscripcion(suscripcionId, usuarioId) {
  const suscripcion = await Suscripcion.findOne({ _id: suscripcionId, usuario: usuarioId });
  if (!suscripcion) throw new Error("Suscripcion no encontrado");

  const anticipada = await Gasto.findOne({
    usuario: usuarioId,
    idOrigen: suscripcion._id,
    anticipado: true
  });

  if (!anticipada) return { mensaje: "No hay factura anticipada que actualizar" };

  anticipada.nombre = suscripcion.nombre;
  anticipada.monto = suscripcion.monto;
  anticipada.categoria = suscripcion.categoria;
  anticipada.unidad = suscripcion.unidad || null;
  anticipada.cantidad = suscripcion.cantidad || null;

  await anticipada.save();
  return anticipada;
}



module.exports = { crearSuscripcionService, listarSuscripcionService, eliminarSuscripcionService, editarSuscripcionService, actualizarFacturaAnticipadaDeSuscripcion, generarFacturasDeSuscripcionesService, eliminarFacturaAnticipada, calcularProximoPago };