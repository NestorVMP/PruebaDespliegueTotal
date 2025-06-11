const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const authMiddleware = require('../middlewares/authMiddleware');
const gastoValidations = require('../validations/gastoValidations');
const validarCampos = require('../middlewares/validationHandler');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const auth = authMiddleware(secretKey);

router.post('/create', auth, gastoValidations.validarGasto, validarCampos, gastoController.crearGasto);
router.get('/list', auth, gastoController.listarGastos);
router.delete('/delete/:id', auth, gastoValidations.validarId, validarCampos, gastoController.eliminarGasto);
router.put('/update/:id', auth, gastoValidations.validarGasto, validarCampos, gastoController.editarGasto);
router.post('/revisar-facturas', auth, gastoController.revisarFacturas);

module.exports = router;