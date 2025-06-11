const { crearGastoService, listarGastosService, eliminarGastoService, editarGastoService, generarFacturasDeGastosService } = require("../services/gastoServices");

const gastoController = {
  crearGasto: [
    async (req, res) => {
      try {
        const datosGasto = {
          ...req.body,
          usuario: req.user.id,
        };
        const nuevoGasto = await crearGastoService(datosGasto);
        res.status(201).json(nuevoGasto);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al crear gasto", error: error.message });
      }
    },
  ],
  listarGastos: [
    async (req, res) => {
      try {
        const gastos = await listarGastosService(req.user.id);
        res.status(200).json(gastos);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al listar gastos", error: error.message });
      }
    },
  ],
  eliminarGasto: [
    async (req, res) => {
      try {
        await eliminarGastoService(req.params.id, req.user.id);
        res.status(200).json({ mensaje: "Gasto eliminado correctamente" });
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al eliminar gasto", error: error.message });
      }
    },
  ],
  editarGasto: [
    async (req, res) => {
      try {
        const gastoEditado = await editarGastoService(
          req.params.id,
          req.body,
          req.user.id
        );
        res.status(200).json(gastoEditado);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al editar gasto", error: error.message });
      }
    },
  ],
  revisarFacturas: [
    async (req, res) => {
      try {
        console.log("req.user.id");
        console.log(req.user.id);
        const zonaHoraria = req.headers['x-timezone'] || 'UTC'; // fallback
        console.log("🕒 Zona horaria del cliente:", zonaHoraria);
        await generarFacturasDeGastosService(req.user.id, zonaHoraria);
        res.status(200).json({ mensaje: "Facturas generadas correctamente" });
      } catch (error) {
        console.error("ERROR al generar facturas pendientes:", error);
        res.status(500).json({ mensaje: "Error al generar facturas", error: error.message, stack: error.stack });
      }
    },
  ]
};

module.exports = gastoController;
