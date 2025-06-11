const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateTokken');

async function crearUsuarioService({ name, email, password, role }) {
  const existe = await Usuario.findOne({ email });
  if (existe) {
    const error = new Error('El email ya está registrado');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Usuario({ name, email, password: hashedPassword, role });
  const savedUser = await newUser.save();

  const token = generateToken(savedUser._id, savedUser.role, savedUser.name, savedUser.email);
  return { user: savedUser, token };
}

async function loginUsuarioService({ email, password }) {
  const user = await Usuario.findOne({ email });
  if (!user) {
    const error = new Error('El email no está registrado');
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Contraseña incorrecta');
    error.status = 401;
    throw error;
  }

  //const token = generateToken(user._id, user.role);
  const token = generateToken(user._id, user.role, user.name, user.email);
  return { user, token };
}

async function actualizarUsuarioService(userId, datos) {
  const user = await Usuario.findById(userId);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  const { name, email, password, role, preferredChart } = datos;

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (preferredChart) user.preferredChart = preferredChart;
  //if ('preferredChart' in datos) user.preferredChart = datos.preferredChart;
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
  }

  return await user.save();
}

async function eliminarUsuarioService(userId) {
  const result = await User.deleteOne({ _id: userId });
  if (result.deletedCount === 0) {
    throw new Error('Usuario no encontrado o ya eliminado');
  }
  return true;
}

module.exports = { crearUsuarioService, loginUsuarioService, actualizarUsuarioService, eliminarUsuarioService };