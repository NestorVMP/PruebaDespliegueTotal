import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle, ResponsiveContainer
} from "recharts";

const colores = {
  total: "#ff6f61",
  suscripcion: "#91caff",
  consumo: "#d4b3ff",
  unico: "#4caf50"
};

const coloresActivos = {
  total: "#ff3c38",
  suscripcion: "#66b3ff",
  consumo: "#c087ff",
  unico: "#66bb6a"
};

const GraficaIndividual = ({ data, tipo }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey={tipo}
        fill={colores[tipo]}
        name={`Gasto en ${tipo}`}
        activeBar={<Rectangle fill={coloresActivos[tipo]} />}
      />
    </BarChart>
  </ResponsiveContainer>
);

export default GraficaIndividual;
