/*const { body } = require('express-validator');

const validarGasto = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre del gasto es obligatorio'),

  body('monto')
    .isFloat({ gt: 0 })
    .withMessage('El monto debe ser un número mayor que 0'),

  body('fecha')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('La fecha no es válida'),

  body('categoria')
    .optional()
    .isString()
    .withMessage('La categoría debe ser una cadena de texto')
];

const validarId = [
  param('id')
    .isMongoId()
    .withMessage('El ID proporcionado no es válido'),
];

module.exports = { validarGasto, validarId };*/

/*const { body, param } = require("express-validator");

const gastoValidations = {
  validarGasto: [
    body("nombre").notEmpty().withMessage("El nombre del gasto es obligatorio"),

    body("monto")
      .isFloat({ gt: 0 })
      .withMessage("El monto debe ser un número mayor que 0"),

    body("fecha")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("La fecha no es válida"),

    body("categoria")
      .optional()
      .isString()
      .withMessage("La categoría debe ser una cadena de texto"),
  ],
  validarId: [
    param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  ],
};

module.exports = gastoValidations;*/

/*const { body, param } = require("express-validator");

const gastoValidations = {
  validarGasto: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del gasto es obligatorio"),

    body("monto")
      .isFloat({ gt: 0 })
      .withMessage("El monto debe ser un número mayor que 0"),

    body("fecha")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("La fecha no es válida"),

    body("categoria")
      .optional()
      .isString()
      .withMessage("La categoría debe ser una cadena de texto"),

    body("anticipado")
      .optional()
      .isBoolean()
      .withMessage("El campo anticipado debe ser true o false"),
  ],

  validarId: [
    param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  ],
};

module.exports = gastoValidations;*/

const { body, param } = require("express-validator");

const gastoValidations = {
  validarGasto: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del gasto es obligatorio"),

    body("monto")
      .isFloat({ gt: 0 })
      .withMessage("El monto debe ser un número mayor que 0"),

    body("fecha")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("La fecha no es válida"),

    body("categoria")
      .optional()
      .isString()
      .withMessage("La categoría debe ser una cadena de texto"),

    body("anticipado")
      .optional()
      .isBoolean()
      .withMessage("El campo anticipado debe ser true o false"),

    body("tipo")
      .optional()
      .isIn(['unico', 'suscripcion', 'consumo'])
      .withMessage("El tipo debe ser: unico, suscripcion o consumo"),

    body("unidad")
      .optional()
      .isString()
      .withMessage("La unidad debe ser una cadena de texto"),

    body("cantidad")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("La cantidad debe ser un número mayor que 0"),

    body("idOrigen")
      .optional()
      .isMongoId()
      .withMessage("El idOrigen debe ser un ID de MongoDB válido"),

  ],

  validarId: [
    param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  ],
};

module.exports = gastoValidations;