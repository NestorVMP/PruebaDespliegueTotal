/*const mongoose = require('mongoose');

const consumoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, required: true }, // ej: Luz, Agua
  monto: { type: Number, required: true },
  unidad: { type: String }, // kWh, m³, etc.
  cantidad: { type: Number }, // ej: 120 kWh
  fecha: { type: Date, default: Date.now },
});

const Consumo = mongoose.model('Consumo', consumoSchema);
module.exports = Consumo;*/

const mongoose = require('mongoose');

const consumoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true }, // ej: Netflix
  monto: { type: Number, required: true },
  unidad: { type: String }, // kWh, m³, etc.
  cantidad: { type: Number }, // ej: 120 kWh
  frecuencia: {
    frecuenciaNumero: { type: Number, required: true },
    frecuenciaUnidad: { type: String, enum: ['dias', 'semanas', 'meses', 'años'], required: true }
  },
  fechaInicio: { type: Date, required: true, default: Date.now },    // histórica
  proximoPago: { type: Date },     // se actualiza cada vez que se genera una factura
  categoria: { type: String }, // ej: comida, ocio, etc.
  activa: { type: Boolean, default: true },        // pausa/resume la facturación
}, { timestamps: true });

const Consumo = mongoose.model('Consumo', consumoSchema);
module.exports = Consumo;