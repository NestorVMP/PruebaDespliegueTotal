const express = require('express');
const router = express.Router();
const consumoController = require('../controllers/consumoController');
const authMiddleware = require('../middlewares/authMiddleware');
const consumoValidations = require('../validations/consumoValidations');
const validarCampos = require('../middlewares/validationHandler');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const auth = authMiddleware(secretKey);

router.post('/create', auth, consumoValidations.validarConsumo, validarCampos,   consumoController.crearConsumo);
router.get('/list', auth, consumoController.listarConsumo);
router.delete('/delete/:id', auth, consumoValidations.validarId, validarCampos,  consumoController.eliminarConsumo);
router.put('/update/:id', auth, consumoValidations.validarConsumo, validarCampos,   consumoController.editarConsumo);
router.post('/generar-facturas', auth, consumoController.generarFacturasPendientes);
router.put('/revision-anticipado/:id', auth, consumoController.revisionAnticipado);

module.exports = router;