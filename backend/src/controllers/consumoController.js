const { crearConsumoService, listarConsumoService, eliminarConsumoService, editarConsumoService, generarFacturasDeConsumosService, actualizarFacturaAnticipadaDeConsumo } = require("../services/consumoServices");

const consumoController = {
  crearConsumo: [
    async (req, res) => {
      try {
        const datosConsumo = {
          ...req.body,
          usuario: req.user.id,
        };

        const nuevoConsumo = await crearConsumoService(datosConsumo);
        res.status(201).json(nuevoConsumo);
      } catch (error) {
        res.status(500).json({ mensaje: "Error al crear consumo", error });
      }
    },
  ],
  listarConsumo: [
    async (req, res) => {
      try {
        const consumo = await listarConsumoService(req.user.id);
        res.status(200).json(consumo);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al listar consumo", error: error.message });
      }
    },
  ],
  eliminarConsumo: [
    async (req, res) => {
      try {
        await eliminarConsumoService(req.params.id, req.user.id);
        res.status(200).json({ mensaje: "Consumo eliminado correctamente" });
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al eliminar consumo", error: error.message });
      }
    },
  ],
  editarConsumo: [
    async (req, res) => {
      try {
        const consumoEditado = await editarConsumoService(
          req.params.id,
          req.body,
          req.user.id
        );
        res.status(200).json(consumoEditado);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al editar consumo", error: error.message });
      }
    },
  ],
  generarFacturasPendientes: [
    async (req, res) => {
      try {
        console.log("req.user.id");
        console.log(req.user.id);
        const zonaHoraria = req.headers['x-timezone'] || 'UTC'; // fallback
        console.log("🕒 Zona horaria del cliente:", zonaHoraria);
        await generarFacturasDeConsumosService(req.user.id, zonaHoraria);
        res.status(200).json({ mensaje: "Facturas generadas correctamente" });
      } catch (error) {
        console.error("ERROR al generar facturas pendientes:", error);
        res.status(500).json({ mensaje: "Error al generar facturas", error: error.message, stack: error.stack });
      }
    },
  ],
  revisionAnticipado: [
    async (req, res) => {
      try {
        const resultado = await actualizarFacturaAnticipadaDeConsumo(req.params.id, req.user.id);
        res.status(200).json(resultado);
      } catch (error) {
        res.status(500).json({ mensaje: "Error al revisar factura anticipada", error: error.message });
      }
    },
  ]
};

module.exports = consumoController;