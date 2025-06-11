const Suscripcion = require('../models/Suscripcion');
const { crearSuscripcionService, listarSuscripcionService, eliminarSuscripcionService, editarSuscripcionService, generarFacturasDeSuscripcionesService, actualizarFacturaAnticipadaDeSuscripcion, eliminarFacturaAnticipada, calcularProximoPago } = require("../services/suscripcionServices");
const { DateTime } = require('luxon');

const suscripcionController = {
  crearSuscripcion: [
    async (req, res) => {
      try {
        const datosSuscripcion = {
          ...req.body,
          usuario: req.user.id,
        };

        const nuevoSuscripcion = await crearSuscripcionService(datosSuscripcion);
        res.status(201).json(nuevoSuscripcion);
      } catch (error) {
        res.status(500).json({ mensaje: "Error al crear suscripcion", error });
      }
    },
  ],
  listarSuscripcion: [
    async (req, res) => {
      try {
        const suscripcion = await listarSuscripcionService(req.user.id);
        res.status(200).json(suscripcion);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al listar suscripcion", error: error.message });
      }
    },
  ],
  eliminarSuscripcion: [
    async (req, res) => {
      try {
        await eliminarSuscripcionService(req.params.id, req.user.id);
        await eliminarFacturaAnticipada(req.params.id, req.user.id );
        res.status(200).json({ mensaje: "Suscripcion eliminado correctamente" });
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al eliminar suscripcion", error: error.message });
      }
    },
  ],
  /*editarSuscripcion: [
    async (req, res) => {
      try {
        console.log("entro");
        const suscripcionEditado = await editarSuscripcionService(
          req.params.id,
          req.body,
          req.user.id
        );
        console.log('editar suscipcion datos:'+req.params.id+'-'+req.body+'-'+req.user.id);
        console.log('suscripcionEditado:'+suscripcionEditado);
        await actualizarFacturaAnticipadaDeSuscripcion(req.params.id, req.user.id);
        res.status(200).json(suscripcionEditado);
      } catch (error) {
        res
          .status(500)
          .json({ mensaje: "Error al editar suscripcion", error: error.message });
      }
    },
  ],*/
  /*editarSuscripcion: [
    async (req, res) => {
      try {
        console.log("entro");
        console.log("req.params.id:", req.params.id);
        console.log("req.user:", req.user);
        const suscripcionId = req.params.id;
        const usuarioId = req.user.id;
        

        const suscripcionOriginal = await Suscripcion.findOne({ _id: req.params.id, usuario: usuarioId });
        console.log('suscripcionOriginal:');
        console.log(suscripcionOriginal);
      } catch (error) {
        console.error("ERROR al buscar suscripción:", error); // 🔥 esta línea es clave
        res.status(500).json({ mensaje: "Error al editar suscripcion", error: error.message });
      }
      console.log("aCABO");
    },
  ],*/
editarSuscripcion: [
  async (req, res) => {
    try {
      // Obtener el estado actual de la suscripción ANTES de editarla
      const suscripcionOriginal = await Suscripcion.findOne({ _id: req.params.id, usuario: req.user.id });
      if (!suscripcionOriginal) {
        return res.status(404).json({ mensaje: "Suscripción no encontrada" });
      }

      // Editar la suscripción con los nuevos datos
      const suscripcionEditada = await editarSuscripcionService(
        req.params.id,
        req.body,
        req.user.id
      );

      const cambioDeEstado = suscripcionOriginal.activa !== req.body.activa;

      if (cambioDeEstado) {
        const zonaHoraria = req.headers['x-timezone'] || 'UTC';

        // Se activó: de false -> true
        if (req.body.activa === true) {
          // Calcular nuevo próximo pago (desde ahora + frecuencia)
          const ahora = DateTime.now().setZone(zonaHoraria);
          const nuevoProximoPago = await calcularProximoPago({
            fechaInicio: ahora.toJSDate(),
            frecuencia: suscripcionEditada.frecuencia
          });

          suscripcionEditada.proximoPago = nuevoProximoPago;
          await suscripcionEditada.save();

          // Generar facturas (con nueva fecha)
          await generarFacturasDeSuscripcionesService(req.user.id, zonaHoraria);
        }

        // Se desactivó: de true -> false
        if (req.body.activa === false) {
          await eliminarFacturaAnticipada(req.params.id, req.user.id);
        }
      }

      res.status(200).json(suscripcionEditada);
    }catch (error) {
      console.error("ERROR al editar suscripción:", error);
      res.status(500).json({ mensaje: "Error al editar suscripción", error: error.message, stack: error.stack });
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
        await generarFacturasDeSuscripcionesService(req.user.id, zonaHoraria);
        res.status(200).json({ mensaje: "Facturas generadas correctamente" });
      } catch (error) {
        console.error("ERROR al generar facturas pendientes:", error); // 👈 Esto imprime TODO el error
        res.status(500).json({ mensaje: "Error al generar facturas", error: error.message, stack: error.stack });
      }
    },
  ],
  revisionAnticipado: [
    async (req, res) => {
      try {
        const resultado = await actualizarFacturaAnticipadaDeSuscripcion(req.params.id, req.user.id);
        res.status(200).json(resultado);
      } catch (error) {
        res.status(500).json({ mensaje: "Error al revisar factura anticipada", error: error.message });
      }
    },
  ]
};

module.exports = suscripcionController;