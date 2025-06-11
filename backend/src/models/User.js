const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del usuario es obligatorio'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email del usuario es obligatoria'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'El formato del email no es válido'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña del usuario es obligatoria'],
    minlength: [5, 'La contraseña debe tener al menos 5 caracteres']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferredChart: {
    type: String,
    enum: ['barra', 'linea', 'none'], // <--- agregas 'none'
    default: 'none'
  }

}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;