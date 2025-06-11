const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');
const categoriaValidations = require('../validations/categoriaValidations');
const validarCampos = require('../middlewares/validationHandler');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;
const auth = authMiddleware(secretKey);

router.post('/create', auth, categoriaValidations.validarCategoria, validarCampos, categoriaController.crearCategoria);
router.get('/list', auth, categoriaController.listarCategorias);

module.exports = router;