const express = require('express');
const router = express.Router();
const enviarCorreos = require('../scripts/cronRunner').enviarCorreos; // Asegúrate de exportarla

router.get('/enviar-correos', async (req, res) => {
  try {
    await enviarCorreos();
    res.status(200).send('✅ Correos enviados correctamente.');
  } catch (err) {
    console.error('❌ Error al enviar correos:', err);
    res.status(500).send('❌ Error al enviar correos.');
  }
});

module.exports = router;