/*const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  categoria: { type: String }, // ej: comida, ocio, etc.
});

const Gasto = mongoose.model('Gasto', gastoSchema);
module.exports = Gasto;*/

/*const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  categoria: { type: String }, // ej: comida, ocio, etc.
  anticipado: { type: Boolean, default: false } // NUEVO campo
});

const Gasto = mongoose.model('Gasto', gastoSchema);
module.exports = Gasto;*/

const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  categoria: { type: String },
  anticipado: { type: Boolean, default: false },

  tipo: {
    type: String,
    enum: ['unico', 'suscripcion', 'consumo'],
    default: 'unico',
  },
  unidad: {
    type: String,
    default: null,
  },
  cantidad: {
    type: Number,
    default: null,
  },
  idOrigen: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }

});

const Gasto = mongoose.model('Gasto', gastoSchema);
module.exports = Gasto;
