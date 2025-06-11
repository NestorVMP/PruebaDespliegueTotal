/*const Consumo = require('../models/Consumo');
const { crearGastoService } = require('./gastoServices');
const Gasto = require('../models/Gasto');
const { DateTime } = require('luxon');

async function crearConsumoService(datosConsumo) {
    try {
      if (!datosConsumo.proximoPago) {
        datosConsumo.proximoPago = datosConsumo.fechaInicio;
      }

      const consumo = new Consumo(datosConsumo);
      const nuevaConsumo = await consumo.save();

      const hoy = new Date();
      const fechaGasto = new Date(datosConsumo.proximoPago);
      const esAnticipado = fechaGasto > hoy;

      await crearGastoService({
        nombre: datosConsumo.nombre,
        monto: datosConsumo.monto,
        fecha: datosConsumo.proximoPago,
        categoria: datosConsumo.categoria,
        usuario: datosConsumo.usuario,
        idOrigen: nuevaConsumo._id,
        anticipado: esAnticipado,
        tipo: 'consumo',
        unidad: datosConsumo.unidad || null,
        cantidad: datosConsumo.cantidad || null
      });

      return nuevaConsumo;

    } catch (err) {
        console.error('Error al crear el consumo:', err);
        throw err;
    }
}

async function listarConsumoService(usuarioId) {
  return await Consumo.find({ usuario: usuarioId }).sort({ createdAt: -1 });
}

async function eliminarConsumoService(consumoId, usuarioId) {
  const result = await Consumo.deleteOne({ _id: consumoId, usuario: usuarioId });
  if (result.deletedCount === 0) throw new Error('No autorizado o consumo no encontrado');
}

async function editarConsumoService(consumoId, nuevosDatos, usuarioId) {
  const consumo = await Consumo.findOneAndUpdate(
    { _id: consumoId, usuario: usuarioId },
    nuevosDatos,
    { new: true }
  );
  if (!consumo) throw new Error('No autorizado o consumo no encontrado');
  return consumo;
}

function calcularProximoPago({ fechaInicio, frecuencia }) {
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

async function generarFacturasDeConsumosService(usuarioId, zonaHoraria) {
  const consumos = await Consumo.find({ usuario: usuarioId, activa: true });
  const hoy = DateTime.now().setZone(zonaHoraria).startOf('day');

  for (const consumo of consumos) {
    let { proximoPago, frecuencia } = consumo;

    await Gasto.updateMany(
      {
        usuario: usuarioId,
        nombre: consumo.nombre,
        anticipado: true,
        fecha: { $lte: hoy }
      },
      { $set: { anticipado: false } }
    );

    let proximoPagoDateTime = DateTime.fromJSDate(proximoPago).startOf('day');
    
    while (proximoPagoDateTime <= hoy) {
      const yaExiste = await Gasto.findOne({
        usuario: usuarioId,
        idOrigen: consumo._id,
        anticipado: false,
        fecha: {
          $gte: proximoPagoDateTime.startOf('day').toJSDate(),
          $lte: proximoPagoDateTime.endOf('day').toJSDate()
        }
      });

      const proximoPagoJS = proximoPagoDateTime.toJSDate();

      if (!yaExiste) {
        await Gasto.create({
          usuario: usuarioId,
          nombre: consumo.nombre,
          monto: consumo.monto,
          fecha: proximoPagoJS,
          categoria: consumo.categoria,
          anticipado: false,
          tipo: 'consumo',
          unidad: consumo.unidad || null,
          cantidad: consumo.cantidad || null,
          idOrigen: consumo._id
        });
      }

      proximoPago = calcularProximoPago({ fechaInicio: proximoPagoJS, frecuencia }); // ✅ CORREGIDO
      proximoPagoDateTime = DateTime.fromJSDate(proximoPago).startOf('day');
    }

    const facturasReales = await Gasto.find({
      usuario: usuarioId,
      idOrigen: consumo._id,
      anticipado: false
    });

    let media = consumo.monto;
    if (facturasReales.length > 0) {
      const suma = facturasReales.reduce((acc, factura) => acc + factura.monto, 0);
      media = suma / facturasReales.length;
    }
    consumo.monto = media;

    const yaExisteAnticipada = await Gasto.findOne({
        usuario: usuarioId,
        idOrigen: consumo._id,
        anticipado: true,
        fecha: {
          $gte: DateTime.fromJSDate(proximoPago).startOf('month').toJSDate(),
          $lte: DateTime.fromJSDate(proximoPago).endOf('month').toJSDate()
        }
    });


    if (!yaExisteAnticipada) {
      await Gasto.create({
        usuario: usuarioId,
        nombre: consumo.nombre,
        monto: consumo.monto,
        fecha: proximoPago,
        categoria: consumo.categoria,
        anticipado: true,
        tipo: 'consumo',
        unidad: consumo.unidad || null,
        cantidad: consumo.cantidad || null,
        idOrigen: consumo._id
      });
    }

    consumo.proximoPago = proximoPago;
    await consumo.save();
  }
}

module.exports = { crearConsumoService, listarConsumoService, eliminarConsumoService, editarConsumoService, generarFacturasDeConsumosService };
*/
const Consumo = require('../models/Consumo');
const { crearGastoService } = require('./gastoServices');
const Gasto = require('../models/Gasto');
const { DateTime } = require('luxon');

async function crearConsumoService(datosConsumo) {
    try {
      if (!datosConsumo.proximoPago) {
        datosConsumo.proximoPago = datosConsumo.fechaInicio;
      }

      const consumo = new Consumo(datosConsumo);
      const nuevaConsumo = await consumo.save();

      const hoy = new Date();
      const fechaGasto = new Date(datosConsumo.proximoPago);
      const esAnticipado = fechaGasto > hoy;

      await crearGastoService({
        nombre: datosConsumo.nombre,
        monto: datosConsumo.monto,
        fecha: datosConsumo.proximoPago,
        categoria: datosConsumo.categoria,
        usuario: datosConsumo.usuario,
        idOrigen: nuevaConsumo._id,
        anticipado: esAnticipado,
        tipo: 'consumo',
        unidad: datosConsumo.unidad || null,
        cantidad: datosConsumo.cantidad || null
      });

      return nuevaConsumo;

    } catch (err) {
        console.error('Error al crear el consumo:', err);
        throw err;
    }
}

async function listarConsumoService(usuarioId) {
  return await Consumo.find({ usuario: usuarioId }).sort({ createdAt: -1 });
}

async function eliminarConsumoService(consumoId, usuarioId) {
  const result = await Consumo.deleteOne({ _id: consumoId, usuario: usuarioId });
  if (result.deletedCount === 0) throw new Error('No autorizado o consumo no encontrado');
}

async function editarConsumoService(consumoId, nuevosDatos, usuarioId) {
  const consumo = await Consumo.findOneAndUpdate(
    { _id: consumoId, usuario: usuarioId },
    nuevosDatos,
    { new: true }
  );
  if (!consumo) throw new Error('No autorizado o consumo no encontrado');
  return consumo;
}


function calcularProximoPago({ fechaInicio, frecuencia }) {
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

async function generarFacturasDeConsumosService(usuarioId, zonaHoraria) {
  const consumos = await Consumo.find({ usuario: usuarioId, activa: true });
  const hoy = DateTime.now().setZone(zonaHoraria).startOf('day');

  for (const consumo of consumos) {
    let { proximoPago, frecuencia } = consumo;

    await Gasto.updateMany(
      {
        usuario: usuarioId,
        nombre: consumo.nombre,
        anticipado: true,
        fecha: { $lte: hoy }
      },
      { $set: { anticipado: false } }
    );

    // ⚡️ Cargar todas las fechas ya facturadas por este consumo
    const facturasExistentes = await Gasto.find({
      usuario: usuarioId,
      idOrigen: consumo._id,
      anticipado: false
    });

    const fechasFacturadas = new Set(
      facturasExistentes.map(f => DateTime.fromJSDate(f.fecha).toISODate())
    );

    let proximoPagoDateTime = DateTime.fromJSDate(proximoPago).startOf('day');

    while (proximoPagoDateTime <= hoy) {
      const fechaClave = proximoPagoDateTime.toISODate();
      const proximoPagoJS = proximoPagoDateTime.toJSDate();

      if (!fechasFacturadas.has(fechaClave)) {
        await Gasto.create({
          usuario: usuarioId,
          nombre: consumo.nombre,
          monto: consumo.monto,
          fecha: proximoPagoJS,
          categoria: consumo.categoria,
          anticipado: false,
          tipo: 'consumo',
          unidad: consumo.unidad || null,
          cantidad: consumo.cantidad || null,
          idOrigen: consumo._id
        });

        fechasFacturadas.add(fechaClave); // para evitar duplicados si entra otra vez
      }

      proximoPago = calcularProximoPago({ fechaInicio: proximoPagoJS, frecuencia });
      proximoPagoDateTime = DateTime.fromJSDate(proximoPago).startOf('day');
    }


    const facturasReales = await Gasto.find({
      usuario: usuarioId,
      idOrigen: consumo._id,
      anticipado: false
    });

    let media = consumo.monto;
    if (facturasReales.length > 0) {
      const suma = facturasReales.reduce((acc, factura) => acc + factura.monto, 0);
      media = suma / facturasReales.length;
    }
    consumo.monto = media;

    const yaExisteAnticipada = await Gasto.findOne({
        usuario: usuarioId,
        idOrigen: consumo._id,
        anticipado: true,
        fecha: {
          $gte: DateTime.fromJSDate(proximoPago).startOf('month').toJSDate(),
          $lte: DateTime.fromJSDate(proximoPago).endOf('month').toJSDate()
        }
    });


    if (!yaExisteAnticipada) {
      await Gasto.create({
        usuario: usuarioId,
        nombre: consumo.nombre,
        monto: consumo.monto,
        fecha: proximoPago,
        categoria: consumo.categoria,
        anticipado: true,
        tipo: 'consumo',
        unidad: consumo.unidad || null,
        cantidad: consumo.cantidad || null,
        idOrigen: consumo._id
      });
    }

    consumo.proximoPago = proximoPago;
    await consumo.save();
  }
}

async function actualizarFacturaAnticipadaDeConsumo(consumoId, usuarioId) {
  const consumo = await Consumo.findOne({ _id: consumoId, usuario: usuarioId });
  if (!consumo) throw new Error("Consumo no encontrado");

  const anticipada = await Gasto.findOne({
    usuario: usuarioId,
    idOrigen: consumo._id,
    anticipado: true
  });

  if (!anticipada) return { mensaje: "No hay factura anticipada que actualizar" };

  anticipada.nombre = consumo.nombre;
  anticipada.monto = consumo.monto;
  anticipada.categoria = consumo.categoria;
  anticipada.unidad = consumo.unidad || null;
  anticipada.cantidad = consumo.cantidad || null;

  await anticipada.save();
  return anticipada;
}

module.exports = { crearConsumoService, listarConsumoService, eliminarConsumoService, editarConsumoService, generarFacturasDeConsumosService, actualizarFacturaAnticipadaDeConsumo };
