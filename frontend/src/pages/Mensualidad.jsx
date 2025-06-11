/*import React, { useMemo, useState,useEffect } from "react";
import { listarConsumoService, listarSuscripcionService, editarSuscripcionService, eliminarSuscripcionService } from "../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { FaEdit, FaTrash } from "react-icons/fa";
import MensualidadEditor from "../components/MensualidadEditor"; // <-- lo crearás después
import { useUser } from '../context/UserContext';
import styles from "./Mensualidad.module.css";
import useCategorias from "../utils/useCategorias";

const Mensualidad = () => {
  //const { timezone } = useUser();
    const { userData } = useUser();
  const { timezone: contextTimezone } = useUser();
  const [timezone, setTimezone] = useState(contextTimezone);
  const queryClient = useQueryClient();
  const { categorias, loading: cargandoCategorias } = useCategorias();
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  // 🔄 Estados para abrir el editor o confirmar eliminación
  const [editorAbierto, setEditorAbierto] = useState(null);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(null);


    useEffect(() => {
      console.log('🔍 localStorage name:', localStorage.getItem('name'));
      console.log('🔍 localStorage preferredChart:', localStorage.getItem('preferredChart'));
      console.log('🔍 localStorage timezone:', localStorage.getItem('timezone'));
      console.log('userData:', userData);
      console.log('timezone:', timezone);
      console.log('contextTimezone:',contextTimezone);
    }, []);
  // 🩹 Fallback si no hay timezone al principio
  useEffect(() => {
    console.log("🧪 Efecto timezone ejecutado. contextTimezone:", contextTimezone);
    if (!contextTimezone) {
      const tzFromStorage = localStorage.getItem("timezone");
      if (tzFromStorage) {
        console.log("🌍 Recuperando timezone desde localStorage:", tzFromStorage);
        setTimezone(tzFromStorage);
      } else {
        console.warn("⚠️ No se encontró timezone ni en contexto ni en localStorage");
      }
    }
  }, []);

  // 2️⃣ Si el contexto se actualiza después, lo usás
  useEffect(() => {
    if (contextTimezone) {
      console.log("⚙️ Sincronizando timezone desde contexto:", contextTimezone);
      setTimezone(contextTimezone);
    }
  }, [contextTimezone]);

  // 🔍 Fetch de datos
  const { data: consumos, isLoading: cargandoConsumos, error: errorConsumos } = useQuery({
    queryKey: ["consumos"],
    queryFn: listarConsumoService,
  });

  const { data: suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useQuery({
    queryKey: ["suscripciones"],
    queryFn: listarSuscripcionService,
  });

  // 🛠️ Mutación para editar suscripción
  const editarSuscripcion = useMutation({
    mutationFn: ({ id, datos }) => editarSuscripcionService(id, datos, timezone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suscripciones"] });
    },
  });

  const eliminarSuscripcion = useMutation({
    mutationFn: (id) => eliminarSuscripcionService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suscripciones"] });
    },
  });

  // 🧠 Normalizar todos los items
  const mensualidades = useMemo(() => {
    if (!consumos || !suscripciones) return [];

    const mapToUnified = (item, tipo) => ({
      id: item._id,
      nombre: item.nombre,
      categoria: item.categoria?.nombre || item.categoria || "Sin categoría",
      monto: item.monto,
      frecuencia: item.frecuencia,
      proximoPago: new Date(item.proximoPago),
      unidad: item.unidad || null,
      cantidad: item.cantidad || null,
      tipo,
      activa: item.activa !== undefined ? item.activa : true,
      original: item,
    });

    let items = [
      ...consumos.map(c => mapToUnified(c, "consumo")),
      ...suscripciones.map(s => mapToUnified(s, "suscripcion")),
    ];

    // ✅ Aplicar filtros
    if (filtroTipo !== "todos") {
      items = items.filter(item => item.tipo === filtroTipo);
    }

    if (filtroCategoria !== "todas") {
      items = items.filter(item => item.categoria === filtroCategoria);
    }

    return items.sort((a, b) => a.proximoPago - b.proximoPago);
  }, [consumos, suscripciones, filtroTipo, filtroCategoria]);


  // 🔁 Toggle activa para suscripciones (y más adelante consumos si añades la API)
  const toggleActiva = (item) => {
    const nuevoEstado = !item.activa;
    const datosActualizados = { ...item.original, activa: nuevoEstado };

    if (item.tipo === "suscripcion") {
      editarSuscripcion.mutate({ id: item.id, datos: datosActualizados });
    } else {
      console.warn("🔧 Falta implementar toggle para consumo:", item);
    }
  };

  const eliminarMensualidad = (item) => {
    const confirmar = window.confirm(`¿Eliminar "${item.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    if (item.tipo === "suscripcion") {
      eliminarSuscripcion.mutate(item.id);
    } else {
      console.warn("🔧 Eliminar consumo no está implementado todavía:", item);
    }
  };

  if (cargandoConsumos || cargandoSuscripciones) return <p>Cargando mensualidades...</p>;
  if (errorConsumos || errorSuscripciones) return <p>Error cargando datos</p>;

  return (
  <div className={styles.contenedor}>
    <h1 className={styles.titulo}>📅 Mensualidades</h1>

    <div className={styles.filtros}>
      <label>
        Tipo:
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="suscripcion">Suscripciones</option>
          <option value="consumo">Consumos</option>
        </select>
      </label>

      <label>
        Categoría:
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="todas">Todas</option>
          {!cargandoCategorias && categorias?.map(cat => (
            <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>
      </label>
    </div>

    {mensualidades.length === 0 ? (
      <p>No hay mensualidades activas.</p>
    ) : (
      <ul className={styles.listaMensualidades}>
        {mensualidades.map((m) => (
          <li
            key={m.id}
            className={`${styles.tarjeta} ${!m.activa ? styles.inactiva : ""} ${m.tipo === "suscripcion" ? styles.suscripcion : styles.consumo}`}
          >
            <div className={styles.acciones}>
              <button onClick={() => setEditorAbierto(m)} title="Editar">
                <FaEdit style={{ color: "#007bff" }} />
              </button>
              <button onClick={() => eliminarMensualidad(m)} title="Eliminar">
                <FaTrash style={{ color: "red" }} />
              </button>
            </div>

            <h2 className={styles.nombre}>{m.nombre}
            <span className={styles.badge}>Cada {m.frecuencia.frecuenciaNumero} {m.frecuencia.frecuenciaUnidad}</span></h2>
            <p className={styles.detalle}>{m.tipo} • {m.categoria}</p>
            <p className={styles.pago}>
              Próximo pago: {format(m.proximoPago, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </p>

            <div className={styles.monto}>
              {m.monto.toFixed(2)} €
            </div>

            {m.unidad && m.cantidad && (
              <div className={styles.unidad}>
                {m.cantidad} × {m.unidad}
              </div>
            )}

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={m.activa}
                onChange={() => toggleActiva(m)}
                disabled={editarSuscripcion.isPending}
              />{" "}
              {m.activa ? "Activa" : "Inactiva"}
            </label>
          </li>
        ))}
      </ul>
    )}

    {editorAbierto && (
      <MensualidadEditor
        item={editorAbierto}
        onCancelar={() => setEditorAbierto(null)}
        onGuardar={(id, datosActualizados) => {
          if (editorAbierto.tipo === "suscripcion") {
            editarSuscripcion.mutate({ id, datos: datosActualizados });
          } else {
            console.warn("🔧 Guardar cambios para consumo no implementado:", datosActualizados);
          }
          setEditorAbierto(null);
        }}
      />
    )}
  </div>
  );
};

export default Mensualidad;*/

/*import React, { useMemo, useState,useEffect } from "react";
import { listarConsumoService, listarSuscripcionService, editarSuscripcionService, eliminarSuscripcionService } from "../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { FaEdit, FaTrash } from "react-icons/fa";
import MensualidadEditor from "../components/MensualidadEditor"; // <-- lo crearás después
import { useUser } from '../context/UserContext';
import styles from "./Mensualidad.module.css";
import useCategorias from "../utils/useCategorias";

const Mensualidad = () => {
  //const { timezone } = useUser();
    const { userData } = useUser();
  const { timezone: contextTimezone } = useUser();
  const [timezone, setTimezone] = useState(contextTimezone);
  const queryClient = useQueryClient();
  const { categorias, loading: cargandoCategorias } = useCategorias();
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  // 🔄 Estados para abrir el editor o confirmar eliminación
  const [editorAbierto, setEditorAbierto] = useState(null);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(null);


    useEffect(() => {
      console.log('🔍 localStorage name:', localStorage.getItem('name'));
      console.log('🔍 localStorage preferredChart:', localStorage.getItem('preferredChart'));
      console.log('🔍 localStorage timezone:', localStorage.getItem('timezone'));
      console.log('userData:', userData);
      console.log('timezone:', timezone);
      console.log('contextTimezone:',contextTimezone);
    }, []);
  // 🩹 Fallback si no hay timezone al principio
  useEffect(() => {
    console.log("🧪 Efecto timezone ejecutado. contextTimezone:", contextTimezone);
    if (!contextTimezone) {
      const tzFromStorage = localStorage.getItem("timezone");
      if (tzFromStorage) {
        console.log("🌍 Recuperando timezone desde localStorage:", tzFromStorage);
        setTimezone(tzFromStorage);
      } else {
        console.warn("⚠️ No se encontró timezone ni en contexto ni en localStorage");
      }
    }
  }, []);

  // 2️⃣ Si el contexto se actualiza después, lo usás
  useEffect(() => {
    if (contextTimezone) {
      console.log("⚙️ Sincronizando timezone desde contexto:", contextTimezone);
      setTimezone(contextTimezone);
    }
  }, [contextTimezone]);

  // 🔍 Fetch de datos
  const { data: consumos, isLoading: cargandoConsumos, error: errorConsumos } = useQuery({
    queryKey: ["consumos"],
    queryFn: listarConsumoService,
  });

  const { data: suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useQuery({
    queryKey: ["suscripciones"],
    queryFn: listarSuscripcionService,
  });

  // 🛠️ Mutación para editar suscripción
  const editarSuscripcion = useMutation({
    mutationFn: ({ id, datos }) => editarSuscripcionService(id, datos, timezone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suscripciones"] });
    },
  });

  const eliminarSuscripcion = useMutation({
    mutationFn: (id) => eliminarSuscripcionService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suscripciones"] });
    },
  });

  // 🧠 Normalizar todos los items
  const mensualidades = useMemo(() => {
    if (!consumos || !suscripciones) return [];

    const mapToUnified = (item, tipo) => ({
      id: item._id,
      nombre: item.nombre,
      categoria: item.categoria?.nombre || item.categoria || "Sin categoría",
      monto: item.monto,
      frecuencia: item.frecuencia,
      proximoPago: new Date(item.proximoPago),
      unidad: item.unidad || null,
      cantidad: item.cantidad || null,
      tipo,
      activa: item.activa !== undefined ? item.activa : true,
      original: item,
    });

    let items = [
      ...consumos.map(c => mapToUnified(c, "consumo")),
      ...suscripciones.map(s => mapToUnified(s, "suscripcion")),
    ];

    // ✅ Aplicar filtros
    if (filtroTipo !== "todos") {
      items = items.filter(item => item.tipo === filtroTipo);
    }

    if (filtroCategoria !== "todas") {
      items = items.filter(item => item.categoria === filtroCategoria);
    }

    return items.sort((a, b) => a.proximoPago - b.proximoPago);
  }, [consumos, suscripciones, filtroTipo, filtroCategoria]);


  // 🔁 Toggle activa para suscripciones (y más adelante consumos si añades la API)
  const toggleActiva = (item) => {
    const nuevoEstado = !item.activa;
    const datosActualizados = { ...item.original, activa: nuevoEstado };

    if (item.tipo === "suscripcion") {
      editarSuscripcion.mutate({ id: item.id, datos: datosActualizados });
    } else {
      console.warn("🔧 Falta implementar toggle para consumo:", item);
    }
  };

  const eliminarMensualidad = (item) => {
    const confirmar = window.confirm(`¿Eliminar "${item.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    if (item.tipo === "suscripcion") {
      eliminarSuscripcion.mutate(item.id);
    } else {
      console.warn("🔧 Eliminar consumo no está implementado todavía:", item);
    }
  };

  if (cargandoConsumos || cargandoSuscripciones) return <p>Cargando mensualidades...</p>;
  if (errorConsumos || errorSuscripciones) return <p>Error cargando datos</p>;

  return (
  <div className={styles.contenedor}>
    <h1 className={styles.titulo}>📅 Mensualidades</h1>

    <div className={styles.filtros}>
      <div className={styles.filtroGrupo}>
        <h4>Filtrar por tipo</h4>
        <div className={styles.botonera}>
          {["todos", "suscripcion", "consumo"].map(tipo => (
            <button
              key={tipo}
              className={`${styles.filtroBtn} ${filtroTipo === tipo ? styles.activo : ""}`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {tipo === "todos" ? "Todos" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filtroGrupo}>
        <h4>Filtrar por categoría</h4>
        <div className={styles.botonera}>
          <button
            className={`${styles.filtroBtn} ${filtroCategoria === "todas" ? styles.activo : ""}`}
            onClick={() => setFiltroCategoria("todas")}
          >
            Todas
          </button>
          {!cargandoCategorias && categorias?.map(cat => (
            <button
              key={cat._id}
              className={`${styles.filtroBtn} ${filtroCategoria === cat.nombre ? styles.activo : ""}`}
              onClick={() => setFiltroCategoria(cat.nombre)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>


    {mensualidades.length === 0 ? (
      <p>No hay mensualidades activas.</p>
    ) : (
      <ul className={styles.listaMensualidades}>
        {mensualidades.map((m) => (
          <li
            key={m.id}
            className={`${styles.tarjeta} ${!m.activa ? styles.inactiva : ""} ${m.tipo === "suscripcion" ? styles.suscripcion : styles.consumo}`}
          >
            <div className={styles.acciones}>
              <button onClick={() => setEditorAbierto(m)} title="Editar">
                <FaEdit style={{ color: "#007bff" }} />
              </button>
              <button onClick={() => eliminarMensualidad(m)} title="Eliminar">
                <FaTrash style={{ color: "red" }} />
              </button>
            </div>

            <h2 className={styles.nombre}>{m.nombre}
            <span className={styles.badge}>Cada {m.frecuencia.frecuenciaNumero} {m.frecuencia.frecuenciaUnidad}</span></h2>
            <p className={styles.detalle}>{m.tipo} • {m.categoria}</p>
            <p className={styles.pago}>
              Próximo pago: {format(m.proximoPago, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </p>

            <div className={styles.monto}>
              {m.monto.toFixed(2)} €
            </div>

            {m.unidad && m.cantidad && (
              <div className={styles.unidad}>
                {m.cantidad} × {m.unidad}
              </div>
            )}

            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={m.activa}
                onChange={() => toggleActiva(m)}
                disabled={editarSuscripcion.isPending}
              />{" "}
              {m.activa ? "Activa" : "Inactiva"}
            </label>
          </li>
        ))}
      </ul>
    )}

    {editorAbierto && (
      <MensualidadEditor
        item={editorAbierto}
        onCancelar={() => setEditorAbierto(null)}
        onGuardar={(id, datosActualizados) => {
          if (editorAbierto.tipo === "suscripcion") {
            editarSuscripcion.mutate({ id, datos: datosActualizados });
          } else {
            console.warn("🔧 Guardar cambios para consumo no implementado:", datosActualizados);
          }
          setEditorAbierto(null);
        }}
      />
    )}
  </div>
  );
};

export default Mensualidad;*/

import React, { useMemo, useState, useEffect } from "react";
import {
  listarConsumoService,
  listarSuscripcionService,
  editarSuscripcionService,
  eliminarSuscripcionService,
} from "../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { FaEdit, FaTrash } from "react-icons/fa";
import MensualidadEditor from "../components/MensualidadEditor";
import { useUser } from '../context/UserContext';
import styles from "./Mensualidad.module.css";

const Mensualidad = () => {
  const { userData, timezone: contextTimezone } = useUser();
  const [timezone, setTimezone] = useState(contextTimezone);
  const queryClient = useQueryClient();
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [editorAbierto, setEditorAbierto] = useState(null);

  useEffect(() => {
    if (!contextTimezone) {
      const tzFromStorage = localStorage.getItem("timezone");
      if (tzFromStorage) {
        setTimezone(tzFromStorage);
      }
    }
  }, []);

  useEffect(() => {
    if (contextTimezone) {
      setTimezone(contextTimezone);
    }
  }, [contextTimezone]);

  const { data: consumos, isLoading: cargandoConsumos, error: errorConsumos } = useQuery({
    queryKey: ["consumos"],
    queryFn: listarConsumoService,
  });

  const { data: suscripciones, isLoading: cargandoSuscripciones, error: errorSuscripciones } = useQuery({
    queryKey: ["suscripciones"],
    queryFn: listarSuscripcionService,
  });

  const editarSuscripcion = useMutation({
    mutationFn: ({ id, datos }) => editarSuscripcionService(id, datos, timezone),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suscripciones"] }),
  });

  const eliminarSuscripcion = useMutation({
    mutationFn: (id) => eliminarSuscripcionService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suscripciones"] }),
  });

  const mensualidades = useMemo(() => {
    if (!consumos || !suscripciones) return [];

    const mapToUnified = (item, tipo) => ({
      id: item._id,
      nombre: item.nombre,
      categoria: item.categoria?.nombre || item.categoria || "Sin categoría",
      monto: item.monto,
      frecuencia: item.frecuencia,
      proximoPago: new Date(item.proximoPago),
      unidad: item.unidad || null,
      cantidad: item.cantidad || null,
      tipo,
      activa: item.activa !== undefined ? item.activa : true,
      original: item,
    });

    let items = [
      ...consumos.map(c => mapToUnified(c, "consumo")),
      ...suscripciones.map(s => mapToUnified(s, "suscripcion")),
    ];

    if (filtroTipo !== "todos") {
      items = items.filter(item => item.tipo === filtroTipo);
    }

    if (filtroCategoria !== "todas") {
      items = items.filter(item => item.categoria === filtroCategoria);
    }

    return items.sort((a, b) => a.proximoPago - b.proximoPago);
  }, [consumos, suscripciones, filtroTipo, filtroCategoria]);

  const categoriasUsadas = useMemo(() => {
    if (!consumos || !suscripciones) return [];

    const todas = [
      ...consumos.map(c => c.categoria?.nombre || c.categoria || "Sin categoría"),
      ...suscripciones.map(s => s.categoria?.nombre || s.categoria || "Sin categoría"),
    ];

    return [...new Set(todas)];
  }, [consumos, suscripciones]);

  const toggleActiva = (item) => {
    const nuevoEstado = !item.activa;
    const datosActualizados = { ...item.original, activa: nuevoEstado };

    if (item.tipo === "suscripcion") {
      editarSuscripcion.mutate({ id: item.id, datos: datosActualizados });
    } else {
      console.warn("🔧 Falta implementar toggle para consumo:", item);
    }
  };

  const eliminarMensualidad = (item) => {
    const confirmar = window.confirm(`¿Eliminar "${item.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    if (item.tipo === "suscripcion") {
      eliminarSuscripcion.mutate(item.id);
    } else {
      console.warn("🔧 Eliminar consumo no está implementado todavía:", item);
    }
  };

  if (cargandoConsumos || cargandoSuscripciones) return <p>Cargando mensualidades...</p>;
  if (errorConsumos || errorSuscripciones) return <p>Error cargando datos</p>;

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>📅 Mensualidades</h1>

      <div className={styles.filtros}>
        <div className={styles.filtroGrupo}>
          <h4>Filtrar por tipo</h4>
          <div className={styles.botonera}>
            {["todos", "suscripcion", "consumo"].map(tipo => (
              <button
                key={tipo}
                className={`${styles.filtroBtn} ${filtroTipo === tipo ? styles.activo : ""}`}
                onClick={() => setFiltroTipo(tipo)}
              >
                {tipo === "todos" ? "Todos" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filtroGrupo}>
          <h4>Filtrar por categoría</h4>
          <div className={styles.botonera}>
            <button
              className={`${styles.filtroBtn} ${filtroCategoria === "todas" ? styles.activo : ""}`}
              onClick={() => setFiltroCategoria("todas")}
            >
              Todas
            </button>
            {categoriasUsadas.map(cat => (
              <button
                key={cat}
                className={`${styles.filtroBtn} ${filtroCategoria === cat ? styles.activo : ""}`}
                onClick={() => setFiltroCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mensualidades.length === 0 ? (
        <p>No hay mensualidades activas.</p>
      ) : (
        <ul className={styles.listaMensualidades}>
          {mensualidades.map((m) => (
            <li
              key={m.id}
              className={`${styles.tarjeta} ${!m.activa ? styles.inactiva : ""} ${m.tipo === "suscripcion" ? styles.suscripcion : styles.consumo}`}
            >
              <div className={styles.acciones}>
                <button onClick={() => setEditorAbierto(m)} title="Editar">
                  <FaEdit style={{ color: "#007bff" }} />
                </button>
                <button onClick={() => eliminarMensualidad(m)} title="Eliminar">
                  <FaTrash style={{ color: "red" }} />
                </button>
              </div>

              <h2 className={styles.nombre}>
                {m.nombre}
                <span className={styles.badge}>
                  Cada {m.frecuencia.frecuenciaNumero} {m.frecuencia.frecuenciaUnidad}
                </span>
              </h2>
              <p className={styles.detalle}>{m.tipo} • {m.categoria}</p>
              <p className={styles.pago}>
                Próximo pago: {format(m.proximoPago, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </p>

              <div className={styles.monto}>
                {m.monto.toFixed(2)} €
              </div>

              {m.unidad && m.cantidad && (
                <div className={styles.unidad}>
                  {m.cantidad} × {m.unidad}
                </div>
              )}

              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={m.activa}
                  onChange={() => toggleActiva(m)}
                  disabled={editarSuscripcion.isPending}
                />{" "}
                {m.activa ? "Activa" : "Inactiva"}
              </label>
            </li>
          ))}
        </ul>
      )}

      {editorAbierto && (
        <MensualidadEditor
          item={editorAbierto}
          onCancelar={() => setEditorAbierto(null)}
          onGuardar={(id, datosActualizados) => {
            if (editorAbierto.tipo === "suscripcion") {
              editarSuscripcion.mutate({ id, datos: datosActualizados });
            } else {
              console.warn("🔧 Guardar cambios para consumo no implementado:", datosActualizados);
            }
            setEditorAbierto(null);
          }}
        />
      )}
    </div>
  );
};

export default Mensualidad;
