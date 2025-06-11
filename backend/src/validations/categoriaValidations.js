const { body } = require("express-validator");

const categoriaValidations = {
  validarCategoria: [
    body('nombre').trim().notEmpty().withMessage('El nombre de la categoría es obligatorio.'),
    body('usuario').optional({ nullable: true }).isMongoId().withMessage('El ID del usuario no es válido.')
  ]
};

module.exports = categoriaValidations;
