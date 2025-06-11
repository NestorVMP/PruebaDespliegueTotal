const { body, param } = require("express-validator");

const consumoValidations = {
  validarConsumo: [
    body("nombre")
      .notEmpty()
      .withMessage("El nombre del consumo es obligatorio")
      .isString()
      .withMessage("El nombre debe ser una cadena de texto"),

    body("monto")
      .notEmpty()
      .withMessage("El monto es obligatorio")
      .isFloat({ gt: 0 })
      .withMessage("El monto debe ser un número mayor que 0"),

    body("unidad")
      .optional()
      .isString()
      .withMessage("La unidad debe ser una cadena de texto"),

    body("cantidad")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("La cantidad debe ser un número mayor que 0"),

    body("frecuencia")
      .notEmpty()
      .withMessage("La frecuencia es obligatoria")
      .custom((value) => {
        if (
          typeof value !== "object" ||
          typeof value.frecuenciaNumero !== "number" ||
          !["dias", "semanas", "meses", "años"].includes(value.frecuenciaUnidad)
        ) {
          throw new Error(
            "La frecuencia debe ser un objeto con frecuenciaNumero (número) y frecuenciaUnidad (dias, semanas, meses, años)"
          );
        }
        return true;
      }),

    body("fechaInicio")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("La fecha de inicio no es válida"),

    body("proximoPago")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("La fecha del próximo pago no es válida"),

    body("categoria")
      .optional()
      .isString()
      .withMessage("La categoría debe ser una cadena de texto"),

    body("activa")
      .optional()
      .isBoolean()
      .withMessage("El campo activa debe ser true o false"),
  ],

  validarId: [
    param("id").isMongoId().withMessage("El ID del consumo no es válido"),
  ],
};

module.exports = consumoValidations;
