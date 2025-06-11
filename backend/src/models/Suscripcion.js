/*const mongoose = require('mongoose');

const suscripcionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  servicio: { type: String, required: true }, // ej: Netflix
  monto: { type: Number, required: true },
  frecuencia: { type: String, enum: ['mensual', 'anual'], default: 'mensual' },
  fechaInicio: { type: Date, required: true },    // histórica
  proximoPago: { type: Date, required: true },     // se actualiza cada vez que se genera una factura
  activa: { type: Boolean, default: true },        // pausa/resume la facturación
}, { timestamps: true });

const Suscripcion = mongoose.model('Suscripcion', suscripcionSchema);
module.exports = Suscripcion;*/

const mongoose = require('mongoose');

const suscripcionSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true }, // ej: Netflix
  monto: { type: Number, required: true },
  frecuencia: {
    frecuenciaNumero: { type: Number, required: true },
    frecuenciaUnidad: { type: String, enum: ['dias', 'semanas', 'meses', 'años'], required: true }
  },
  fechaInicio: { type: Date, required: true, default: Date.now },    // histórica
  proximoPago: { type: Date },     // se actualiza cada vez que se genera una factura
  categoria: { type: String }, // ej: comida, ocio, etc.
  activa: { type: Boolean, default: true }        // pausa/resume la facturación

}, { timestamps: true });

const Suscripcion = mongoose.model('Suscripcion', suscripcionSchema);
module.exports = Suscripcion;