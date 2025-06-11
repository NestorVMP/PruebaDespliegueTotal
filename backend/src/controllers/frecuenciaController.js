const Frecuencia = require('../models/Frecuencia');

const frecuenciaController = {
  listarFrecuencias: [
    async (req, res) => {
      try {
        const usuarioId = req.user.id;
        const frecuencias = await Frecuencia.find({
          $or: [
            { usuario: null },
            { usuario: usuarioId }
          ]
        });//.sort({ frecuenciaNumero: 1 }); // opcional: ordenado por número
        res.json(frecuencias);
      } catch (error) {
        res.status(500).json({ mensaje: "Error al listar las frecuencias", error });
      }
    }
  ],

  crearFrecuencia: [
    async (req, res) => {
      try {
        const { frecuenciaNumero, frecuenciaUnidad } = req.body;
        const usuarioId = req.user.id;
        const rol = req.user.role;
        const usuarioFrecuencia = rol === 'admin' ? null : usuarioId;
        
        const frecuencia = new Frecuencia({ frecuenciaNumero, frecuenciaUnidad, usuario: usuarioFrecuencia });
        await frecuencia.save();

        res.status(201).json(frecuencia);
      } catch (error) {
        res.status(500).json({
          mensaje: "Error al crear la frecuencia",
          error: error.message,
        });
      }
    }
  ]
};

module.exports = frecuenciaController;