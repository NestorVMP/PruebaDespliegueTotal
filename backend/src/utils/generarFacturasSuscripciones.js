const Suscripcion = require('../models/Suscripcion');
const { crearGastoService } = require('../services/gastoServices');

async function generarFacturasSuscripciones() {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // comparar solo fecha, no hora

    const suscripciones = await Suscripcion.find({
      activa: true,
      proximoPago: { $lte: hoy },
    });

    for (const suscripcion of suscripciones) {
      // 1. Crear factura
      await crearGastoService({
        nombre: suscripcion.nombre,
        monto: suscripcion.monto,
        fecha: suscripcion.proximoPago,
        categoria: suscripcion.categoria,
        usuario: suscripcion.usuario,
        suscripcionId: suscripcion._id
      });

      // 2. Calcular nueva fecha
      const nuevaFecha = new Date(suscripcion.proximoPago);
      if (suscripcion.frecuencia === 'mensual') {
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
      } else if (suscripcion.frecuencia === 'anual') {
        nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
      }

      // 3. Actualizar suscripción
      suscripcion.proximoPago = nuevaFecha;
      await suscripcion.save();
    }

    return { totalFacturas: suscripciones.length };
  } catch (error) {
    console.error('Error generando facturas de suscripciones:', error);
    throw error;
  }
}

module.exports = generarFacturasSuscripciones;
