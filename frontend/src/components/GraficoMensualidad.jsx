import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const coloresPorTipo = {
  todos: "#cccccc", // gris claro neutro
  suscripcion: "#91caff", // azul claro
  consumo: "#d4b3ff", // morado claro
  unico: "#4caf50", // verde
};

const GraficoMensualidad = ({ gastos }) => {
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const gastosFiltrados = useMemo(() => {
    if (tipoFiltro === "todos") return gastos;
    return gastos.filter(g => g.tipo === tipoFiltro);
  }, [gastos, tipoFiltro]);

  const datosPorMes = useMemo(() => {
    const datos = {};

    gastosFiltrados.forEach(g => {
      const fecha = new Date(g.fecha);
      const clave = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, "0")}`;
      datos[clave] = (datos[clave] || 0) + g.monto;
    });

    return Object.entries(datos)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([mes, monto]) => ({ mes, monto }));
  }, [gastosFiltrados]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setTipoFiltro("todos")}>Todos</button>
        <button onClick={() => setTipoFiltro("suscripcion")}>Suscripciones</button>
        <button onClick={() => setTipoFiltro("consumo")}>Consumos</button>
        <button onClick={() => setTipoFiltro("unico")}>Únicos</button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datosPorMes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="monto"
            fill={coloresPorTipo[tipoFiltro]}
            name="Gasto mensual (€)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoMensualidad;
