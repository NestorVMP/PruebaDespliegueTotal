const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;