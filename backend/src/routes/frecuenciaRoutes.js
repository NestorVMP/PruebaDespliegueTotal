const express = require('express');
const router = express.Router();
const frecuenciaController = require('../controllers/frecuenciaController');
const authMiddleware = require('../middlewares/authMiddleware');
const frecuenciaValidations = require('../validations/frecuenciaValidations');
const validarCampos = require('../middlewares/validationHandler');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const auth = authMiddleware(secretKey);

router.post('/create', auth, frecuenciaValidations.validarFrecuencia, validarCampos, frecuenciaController.crearFrecuencia);
router.get('/list', auth, frecuenciaController.listarFrecuencias);

module.exports = router;