const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcionController');
const authMiddleware = require('../middlewares/authMiddleware');
const suscripcionValidations = require('../validations/suscripcionValidations');
const validarCampos = require('../middlewares/validationHandler');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const auth = authMiddleware(secretKey);

router.post('/create', auth, suscripcionValidations.validarSuscripcion, validarCampos,  suscripcionController.crearSuscripcion);
router.get('/list', auth, suscripcionController.listarSuscripcion);
router.delete('/delete/:id', auth, suscripcionValidations.validarId, validarCampos,  suscripcionController.eliminarSuscripcion);
router.put('/update/:id', auth, suscripcionValidations.validarSuscripcion, validarCampos,  suscripcionController.editarSuscripcion);
router.post('/generar-facturas', auth, suscripcionController.generarFacturasPendientes);
router.put('/revision-anticipado/:id', auth, suscripcionController.revisionAnticipado);

module.exports = router;