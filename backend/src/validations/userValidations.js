const { body, param } = require('express-validator');

const userValidations = {
  validarRegistro: [
    body('name')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),

    body('email')
      .notEmpty()
      .withMessage('El email es obligatorio')
      .isEmail()
      .withMessage('El formato del email no es válido'),

    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
      .isLength({ min: 5 })
      .withMessage('La contraseña debe tener al menos 5 caracteres'),

    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('El rol debe ser user o admin')
  ],

  validarLogin: [
    body('email')
      .notEmpty()
      .withMessage('El email es obligatorio')
      .isEmail()
      .withMessage('El formato del email no es válido'),

    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
  ],

  validarActualizacion: [
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),

    body('email')
      .optional()
      .isEmail()
      .withMessage('El email no tiene un formato válido'),

    body('password')
      .optional()
      .isLength({ min: 5 })
      .withMessage('La contraseña debe tener al menos 5 caracteres'),

    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('El rol debe ser user o admin'),

    body('preferredChart')
      .optional()
      .isIn(['barra', 'linea', 'none']) // <--- aquí también
      .withMessage('El tipo de gráfico preferido debe ser "barra", "linea" o "none"')
  ],


  validarId: [
    param('id')
      .isMongoId()
      .withMessage('El ID proporcionado no es válido')
  ]
};

module.exports = userValidations;