import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle, ResponsiveContainer
} from "recharts";

const GraficaComparativa = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="suscripcion" fill="#91caff" name="Suscripciones" activeBar={<Rectangle fill="#66b3ff" />} />
      <Bar dataKey="consumo" fill="#d4b3ff" name="Consumos" activeBar={<Rectangle fill="#c087ff" />} />
      <Bar dataKey="unico" fill="#4caf50" name="Gastos únicos" activeBar={<Rectangle fill="#66bb6a" />} />
    </BarChart>
  </ResponsiveContainer>
);

export default GraficaComparativa;
