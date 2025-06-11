const Categoria = require('../models/Categoria');

const categoriaController = {
  listarCategorias: [
    async (req, res) => {
      try {
        const usuarioId = req.user.id;
        const categorias = await Categoria.find({
            $or: [
            { usuario: null }, // globales
            { usuario: usuarioId } // propias
            ]
        });
        res.json(categorias);
      } catch (error) {
        res.status(500).json({ mensaje: "Error al listar las categorias", error });
      }
    },
  ],

  crearCategoria: [
    async (req, res) => {
      try {
        const { nombre } = req.body;
        const usuarioId = req.user.id;
        const rol = req.user.role; // 👈 suponiendo que en el JWT tienes el rol
        const usuarioCategoria = rol === 'admin' ? null : usuarioId;

        const categoria = new Categoria({ nombre, usuario: usuarioCategoria });
        await categoria.save();

        res.status(201).json(categoria);
      } catch (error) {
        res.status(500).json({
          mensaje: "Error al crear la categoría",
          error: error.message,
        });
      }
    },
  ]
};

module.exports = categoriaController;