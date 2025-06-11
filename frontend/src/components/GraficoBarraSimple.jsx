/*import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

const GraficoBarraSimple = ({ gastos }) => {
  // Procesamos los datos
  const datosAgrupados = useMemo(() => {
    const agrupados = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!agrupados[mes]) {
        agrupados[mes] = { mes, suscripcion: 0, consumo: 0, unico: 0 };
      }

      agrupados[mes][g.tipo] += g.monto;
    });

    return Object.values(agrupados).sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>📊 Comparativa de tipos de gasto por mes (barras)</h3>
      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart
          data={datosAgrupados}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="suscripcion"
            fill="#91caff"
            name="Suscripciones"
            activeBar={<Rectangle fill="#66b3ff" stroke="#3399ff" />}
          />
          <Bar
            dataKey="consumo"
            fill="#d4b3ff"
            name="Consumos"
            activeBar={<Rectangle fill="#c087ff" stroke="#a34eff" />}
          />
          <Bar
            dataKey="unico"
            fill="#4caf50"
            name="Gastos únicos"
            activeBar={<Rectangle fill="#66bb6a" stroke="#388e3c" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarraSimple;*/

/*import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

const colores = {
  suscripcion: "#91caff",
  consumo: "#d4b3ff",
  unico: "#4caf50",
  total: "#ff6f61"
};

const coloresActivos = {
  suscripcion: "#66b3ff",
  consumo: "#c087ff",
  unico: "#66bb6a",
  total: "#ff3c38"
};

const modos = {
  COMPARATIVA: "comparativa",
  TOTAL: "total",
  SUSCRIPCION: "suscripcion",
  CONSUMO: "consumo",
  UNICO: "unico"
};

const GraficoBarraSimple = ({ gastos }) => {
  const [modo, setModo] = useState(modos.COMPARATIVA);

  const datosAgrupados = useMemo(() => {
    const agrupados = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!agrupados[mes]) {
        agrupados[mes] = { mes, suscripcion: 0, consumo: 0, unico: 0 };
      }

      agrupados[mes][g.tipo] += g.monto;
    });

    return Object.values(agrupados)
      .map(d => ({
        ...d,
        total: d.suscripcion + d.consumo + d.unico
      }))
      .sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  const titulos = {
    comparativa: "📊 Comparativa de tipos de gasto por mes (barras)",
    total: "💰 Gasto total mensual (barras)",
    suscripcion: "🔵 Gasto mensual en suscripciones (barras)",
    consumo: "🟣 Gasto mensual en consumos (barras)",
    unico: "🟢 Gasto mensual en gastos únicos (barras)"
  };

  const renderizarBarras = () => {
    switch (modo) {
      case modos.COMPARATIVA:
        return (
          <>
            <Bar
              dataKey="suscripcion"
              fill={colores.suscripcion}
              name="Suscripciones"
              activeBar={<Rectangle fill={coloresActivos.suscripcion} stroke="#3399ff" />}
            />
            <Bar
              dataKey="consumo"
              fill={colores.consumo}
              name="Consumos"
              activeBar={<Rectangle fill={coloresActivos.consumo} stroke="#a34eff" />}
            />
            <Bar
              dataKey="unico"
              fill={colores.unico}
              name="Gastos únicos"
              activeBar={<Rectangle fill={coloresActivos.unico} stroke="#388e3c" />}
            />
          </>
        );
      case modos.TOTAL:
        return (
          <Bar
            dataKey="total"
            fill={colores.total}
            name="Gasto total"
            activeBar={<Rectangle fill={coloresActivos.total} stroke="#b71c1c" />}
          />
        );
      case modos.SUSCRIPCION:
      case modos.CONSUMO:
      case modos.UNICO:
        return (
          <Bar
            dataKey={modo}
            fill={colores[modo]}
            name={`Gasto en ${modo}`}
            activeBar={<Rectangle fill={coloresActivos[modo]} stroke="#333" />}
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

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={datosAgrupados}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          {renderizarBarras()}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarraSimple;*/

// Componente principal
/*import React, { useMemo, useState } from "react";
import GraficaComparativa from "./GraficaComparativa";
import GraficaIndividual from "./GraficaIndividual";

const modos = {
  COMPARATIVA: "comparativa",
  TOTAL: "total",
  SUSCRIPCION: "suscripcion",
  CONSUMO: "consumo",
  UNICO: "unico"
};

const GraficoBarraSimple = ({ gastos }) => {
  const [modo, setModo] = useState(modos.COMPARATIVA);

  const datosAgrupados = useMemo(() => {
    const agrupados = {};

    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!agrupados[mes]) {
        agrupados[mes] = { mes, suscripcion: 0, consumo: 0, unico: 0 };
      }

      agrupados[mes][g.tipo] += g.monto;
    });

    return Object.values(agrupados)
      .map(d => ({ ...d, total: d.suscripcion + d.consumo + d.unico }))
      .sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  const titulos = {
    comparativa: "📊 Comparativa de tipos de gasto por mes (barras)",
    total: "💰 Gasto total mensual (barras)",
    suscripcion: "🔵 Gasto mensual en suscripciones (barras)",
    consumo: "🟣 Gasto mensual en consumos (barras)",
    unico: "🟢 Gasto mensual en gastos únicos (barras)"
  };

  return (
    <div style={{ width: "100%", height: 420, background: "#f9f9f9", padding: 16 }}>
      <h3>{titulos[modo]}</h3>

      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setModo(modos.COMPARATIVA)}>Comparativa</button>
        <button onClick={() => setModo(modos.TOTAL)}>Total</button>
        <button onClick={() => setModo(modos.SUSCRIPCION)}>Suscripciones</button>
        <button onClick={() => setModo(modos.CONSUMO)}>Consumos</button>
        <button onClick={() => setModo(modos.UNICO)}>Únicos</button>
      </div>

      {modo === modos.COMPARATIVA ? (
        <GraficaComparativa data={datosAgrupados} />
      ) : (
        <GraficaIndividual data={datosAgrupados} tipo={modo} />
      )}
    </div>
  );
};

export default GraficoBarraSimple;*/

import React, { useMemo, useState } from "react";
import GraficaComparativa from "./GraficaComparativa";
import GraficaIndividual from "./GraficaIndividual";
import styles from "./GraficoBarraSimple.module.css";

const modos = {
  COMPARATIVA: "comparativa",
  TOTAL: "total",
  SUSCRIPCION: "suscripcion",
  CONSUMO: "consumo",
  UNICO: "unico",
};

const GraficoBarraSimple = ({ gastos }) => {
  const [modo, setModo] = useState(modos.COMPARATIVA);

  const datosAgrupados = useMemo(() => {
    const agrupados = {};

    gastos.forEach((g) => {
      const fecha = new Date(g.fecha);
      const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!agrupados[mes]) {
        agrupados[mes] = { mes, suscripcion: 0, consumo: 0, unico: 0 };
      }

      agrupados[mes][g.tipo] += g.monto;
    });

    return Object.values(agrupados)
      .map((d) => ({
        ...d,
        total: d.suscripcion + d.consumo + d.unico,
      }))
      .sort((a, b) => new Date(a.mes) - new Date(b.mes));
  }, [gastos]);

  const titulos = {
    comparativa: "📊 Comparativa de tipos de gasto por mes",
    total: "💰 Gasto total mensual",
    suscripcion: "🔵 Gasto mensual en suscripciones",
    consumo: "🟣 Gasto mensual en consumos",
    unico: "🟢 Gasto mensual en gastos únicos",
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.titulo}>{titulos[modo]}</h3>

      <div className={styles.botones}>
        <button
          onClick={() => setModo(modos.COMPARATIVA)}
          //className={modo === modos.COMPARATIVA ? styles.activo : ""}
          className={`${modo === modos.COMPARATIVA ? `${styles.activo} ${styles.comparativa}` : ''}`}
        >
          Comparativa
        </button>
        <button
          onClick={() => setModo(modos.TOTAL)}
          //className={modo === modos.TOTAL ? styles.activo : ""}
          className={`${modo === modos.TOTAL ? `${styles.activo} ${styles.total}` : ''}`}
        >
          Total
        </button>
        <button
          onClick={() => setModo(modos.SUSCRIPCION)}
          //className={modo === modos.SUSCRIPCION ? styles.activo : ""}
          className={`${modo === modos.SUSCRIPCION ? `${styles.activo} ${styles.suscripcion}` : ''}`}
        >
          Suscripciones
        </button>
        <button
          onClick={() => setModo(modos.CONSUMO)}
          //className={modo === modos.CONSUMO ? styles.activo : ""}
          className={`${modo === modos.CONSUMO ? `${styles.activo} ${styles.consumo}` : ''}`}
        >
          Consumos
        </button>
        <button
          onClick={() => setModo(modos.UNICO)}
          //className={modo === modos.UNICO ? styles.activo : ""}
          className={`${modo === modos.UNICO ? `${styles.activo} ${styles.unico}` : ''}`}
        >
          Únicos
        </button>
      </div>

      <div className={styles.graficoContainer}>
        {modo === modos.COMPARATIVA ? (
          <GraficaComparativa data={datosAgrupados} />
        ) : (
          <GraficaIndividual data={datosAgrupados} tipo={modo} />
        )}
      </div>
    </div>
  );
};

export default GraficoBarraSimple;