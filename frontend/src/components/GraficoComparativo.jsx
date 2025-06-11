/*import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const GraficoComparativo = ({ gastos }) => {
  // Agrupar los gastos por mes y tipo
  const datosComparativos = useMemo(() => {
    const acumulado = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!acumulado[mes]) {
        acumulado[mes] = { mes, unico: 0, suscripcion: 0, consumo: 0 };
      }

      acumulado[mes][g.tipo] += g.monto;
    });

    // Convertir a array ordenado
    return Object.values(acumulado).sort((a, b) =>
      new Date(a.mes) - new Date(b.mes)
    );
  }, [gastos]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>📈 Comparativa mensual por tipo de gasto</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={datosComparativos}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="suscripcion"
            stroke="#91caff"
            name="Suscripciones"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="consumo"
            stroke="#d4b3ff"
            name="Consumos"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="unico"
            stroke="#4caf50"
            name="Gastos únicos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoComparativo;*/

/*import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const colores = {
  suscripcion: "#91caff",
  consumo: "#d4b3ff",
  unico: "#4caf50",
  total: "#ff6f61"
};

const modos = {
  COMPARATIVA: "comparativa",
  TOTAL: "total",
  SUSCRIPCION: "suscripcion",
  CONSUMO: "consumo",
  UNICO: "unico"
};

const GraficoComparativo = ({ gastos }) => {
  const [modo, setModo] = useState(modos.COMPARATIVA);

  // Agrupar gastos por mes
  const datosPorMes = useMemo(() => {
    const acumulado = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!acumulado[mes]) {
        acumulado[mes] = { mes, unico: 0, suscripcion: 0, consumo: 0 };
      }

      acumulado[mes][g.tipo] += g.monto;
    });

    const datos = Object.values(acumulado).map(d => ({
      ...d,
      total: d.unico + d.suscripcion + d.consumo
    }));
      console.log("datosPorMes:", datos);
    return datos.sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  // Definir el contenido del gráfico según el modo
  const renderizarLineas = () => {
    console.log("Modo:", modo);
console.log("Datos:", datosPorMes);

    switch (modo) {
      case modos.COMPARATIVA:
        return (
          <>
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="suscripcion"
              stroke={colores.suscripcion}
              name="Suscripciones"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="consumo"
              stroke={colores.consumo}
              name="Consumos"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="unico"
              stroke={colores.unico}
              name="Gastos únicos"
            />
          </>
        );

      case modos.TOTAL:
        return (
          <Line yAxisId="left" type="monotone" dataKey="total" stroke={colores.total} name="Gasto total mensual" />
        );
      case modos.SUSCRIPCION:
      case modos.CONSUMO:
      case modos.UNICO:
        return (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={modo}
            stroke={colores[modo]}
            name={`Gasto en ${modo}`}
          />
        );
      default:
        return null;
    }
  };

  // Título según modo
  const titulos = {
    comparativa: "📈 Comparativa mensual por tipo de gasto",
    total: "💰 Gasto total mensual",
    suscripcion: "🔵 Gasto mensual en suscripciones",
    consumo: "🟣 Gasto mensual en consumos",
    unico: "🟢 Gasto mensual en gastos únicos"
  };

  return (
    <div style={{ width: "100%", height: 420 }}>
      <h3>{titulos[modo]}</h3>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setModo(modos.COMPARATIVA)}>Comparativa</button>
        <button onClick={() => setModo(modos.TOTAL)}>Total</button>
        <button onClick={() => setModo(modos.SUSCRIPCION)}>Suscripciones</button>
        <button onClick={() => setModo(modos.CONSUMO)}>Consumos</button>
        <button onClick={() => setModo(modos.UNICO)}>Únicos</button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={datosPorMes}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis yAxisId="left" />
          {modo === modos.COMPARATIVA && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={['auto', 'auto']}
            />
          )}

          <Tooltip />
          <Legend />
          {renderizarLineas()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoComparativo;*/

/*import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const colores = {
  suscripcion: "#91caff",
  consumo: "#d4b3ff",
  unico: "#4caf50",
  total: "#ff6f61"
};

const modos = {
  COMPARATIVA: "comparativa",
  TOTAL: "total",
  SUSCRIPCION: "suscripcion",
  CONSUMO: "consumo",
  UNICO: "unico"
};

const GraficoComparativo = ({ gastos }) => {
  const [modo, setModo] = useState(modos.COMPARATIVA);

  // Agrupar gastos por mes
  const datosPorMes = useMemo(() => {
    const acumulado = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!acumulado[mes]) {
        acumulado[mes] = { mes, unico: 0, suscripcion: 0, consumo: 0 };
      }

      acumulado[mes][g.tipo] += g.monto;
    });

    return Object.values(acumulado)
      .map(d => ({
        ...d,
        total: d.unico + d.suscripcion + d.consumo
      }))
      .sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  const titulos = {
    comparativa: "📈 Comparativa mensual por tipo de gasto",
    total: "💰 Gasto total mensual",
    suscripcion: "🔵 Gasto mensual en suscripciones",
    consumo: "🟣 Gasto mensual en consumos",
    unico: "🟢 Gasto mensual en gastos únicos"
  };

  // Vista comparativa separada (la que sí te funciona bien)
  const renderizarComparativaCorrecta = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={datosPorMes}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="suscripcion"
          stroke={colores.suscripcion}
          name="Suscripciones"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="consumo"
          stroke={colores.consumo}
          name="Consumos"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="unico"
          stroke={colores.unico}
          name="Gastos únicos"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Otras visualizaciones según modo
  const renderizarLineasPorModo = () => {
    switch (modo) {
      case modos.TOTAL:
        return (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total"
            stroke={colores.total}
            name="Gasto total mensual"
          />
        );
      case modos.SUSCRIPCION:
      case modos.CONSUMO:
      case modos.UNICO:
        return (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={modo}
            stroke={colores[modo]}
            name={`Gasto en ${modo}`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "100%", height: 420 }}>
      <h3>{titulos[modo]}</h3>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setModo(modos.COMPARATIVA)}>Comparativa</button>
        <button onClick={() => setModo(modos.TOTAL)}>Total</button>
        <button onClick={() => setModo(modos.SUSCRIPCION)}>Suscripciones</button>
        <button onClick={() => setModo(modos.CONSUMO)}>Consumos</button>
        <button onClick={() => setModo(modos.UNICO)}>Únicos</button>
      </div>

      {modo === modos.COMPARATIVA ? (
        renderizarComparativaCorrecta()
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datosPorMes}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" />
            <Tooltip />
            <Legend />
            {renderizarLineasPorModo()}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficoComparativo;*/

import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "./GraficoComparativo.module.css";

const colores = {
  suscripcion: "#91caff",
  consumo: "#d4b3ff",
  unico: "#4caf50",
  total: "#ff6f61"
};

const modos = {
  COMPARATIVA: "comparativa",
  TOTAL: "total",
  SUSCRIPCION: "suscripcion",
  CONSUMO: "consumo",
  UNICO: "unico"
};

const GraficoComparativo = ({ gastos }) => {
  const [modo, setModo] = useState(modos.COMPARATIVA);

  // Agrupar gastos por mes
  const datosPorMes = useMemo(() => {
    const acumulado = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!acumulado[mes]) {
        acumulado[mes] = { mes, unico: 0, suscripcion: 0, consumo: 0 };
      }

      acumulado[mes][g.tipo] += g.monto;
    });

    return Object.values(acumulado)
      .map(d => ({
        ...d,
        total: d.unico + d.suscripcion + d.consumo
      }))
      .sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  const titulos = {
    comparativa: "📈 Comparativa mensual por tipo de gasto",
    total: "💰 Gasto total mensual",
    suscripcion: "🔵 Gasto mensual en suscripciones",
    consumo: "🟣 Gasto mensual en consumos",
    unico: "🟢 Gasto mensual en gastos únicos"
  };

  // Vista comparativa separada (la que sí te funciona bien)
  const renderizarComparativaCorrecta = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={datosPorMes}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="suscripcion"
          stroke={colores.suscripcion}
          name="Suscripciones"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="consumo"
          stroke={colores.consumo}
          name="Consumos"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="unico"
          stroke={colores.unico}
          name="Gastos únicos"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Otras visualizaciones según modo
  const renderizarLineasPorModo = () => {
    switch (modo) {
      case modos.TOTAL:
        return (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total"
            stroke={colores.total}
            name="Gasto total mensual"
          />
        );
      case modos.SUSCRIPCION:
      case modos.CONSUMO:
      case modos.UNICO:
        return (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={modo}
            stroke={colores[modo]}
            name={`Gasto en ${modo}`}
          />
        );
      default:
        return null;
    }
  };

return (
  <div className={styles.wrapper}>
    <h3 className={styles.titulo}>{titulos[modo]}</h3>

    <div className={styles.botones}>
      <button
        onClick={() => setModo(modos.COMPARATIVA)}
        className={`${styles.boton} ${modo === modos.COMPARATIVA ? `${styles.activo} ${styles.comparativa}` : ""}`}
      >
        Comparativa
      </button>
      <button
        onClick={() => setModo(modos.TOTAL)}
        className={`${styles.boton} ${modo === modos.TOTAL ? `${styles.activo} ${styles.total}` : ""}`}
      >
        Total
      </button>
      <button
        onClick={() => setModo(modos.SUSCRIPCION)}
        className={`${styles.boton} ${modo === modos.SUSCRIPCION ? `${styles.activo} ${styles.suscripcion}` : ""}`}
      >
        Suscripciones
      </button>
      <button
        onClick={() => setModo(modos.CONSUMO)}
        className={`${styles.boton} ${modo === modos.CONSUMO ? `${styles.activo} ${styles.consumo}` : ""}`}
      >
        Consumos
      </button>
      <button
        onClick={() => setModo(modos.UNICO)}
        className={`${styles.boton} ${modo === modos.UNICO ? `${styles.activo} ${styles.unico}` : ""}`}
      >
        Únicos
      </button>
    </div>

    {modo === modos.COMPARATIVA ? (
      <div className={styles.grafico}>
        {renderizarComparativaCorrecta()}
      </div>
    ) : (
      <div className={styles.grafico}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datosPorMes}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis yAxisId="left" />
            <Tooltip />
            <Legend />
            {renderizarLineasPorModo()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

};

export default GraficoComparativo;