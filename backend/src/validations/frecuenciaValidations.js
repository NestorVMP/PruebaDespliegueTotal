const { body } = require("express-validator");

const validUnidades = ['dias', 'semanas', 'meses', 'años'];

const frecuenciaValidations = {
  validarFrecuencia: [
    body('frecuenciaNumero')
    .isInt({ min: 1 }).withMessage('La frecuencia debe ser un número entero mayor a 0'),
    body('frecuenciaUnidad')
    .isIn(validUnidades).withMessage('La unidad de frecuencia no es válida')
  ]
};

module.exports = frecuenciaValidations;