const mongoose = require('mongoose');

const frecuenciaSchema = new mongoose.Schema({
    frecuenciaNumero: { type: Number, required: true },
    frecuenciaUnidad: { type: String, enum: ['dias', 'semanas', 'meses', 'años'], required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null }
}, { timestamps: true });

const Frecuencia = mongoose.model('Frecuencia', frecuenciaSchema);
module.exports = Frecuencia;