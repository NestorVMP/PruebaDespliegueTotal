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

    const resultado = Object.values(agrupados)
      .map((d) => ({
        ...d,
        total: d.suscripcion + d.consumo + d.unico,
      }))
      .sort((a, b) => new Date(a.mes) - new Date(b.mes));

    console.log("💡 datosAgrupados para gráfica y resumen email:", resultado);
    return resultado;
  }, [gastos]);


  const resumenMensual = useMemo(() => {
    if (!datosAgrupados || datosAgrupados.length === 0) return null;

    const ultimoMes = datosAgrupados[datosAgrupados.length - 1];
    const { mes, suscripcion, consumo, unico, total } = ultimoMes;

    const gastosPorTipo = [
      { tipo: 'suscripciones', monto: suscripcion },
      { tipo: 'consumos', monto: consumo },
      { tipo: 'gastos únicos', monto: unico },
    ].sort((a, b) => b.monto - a.monto);

    const partes = gastosPorTipo
      .filter(g => g.monto > 0)
      .map(g => `${g.tipo} con ${g.monto.toFixed(2)}€`);

    const listaPartes = partes.length > 1
      ? `${partes.slice(0, -1).join(', ')} y ${partes.slice(-1)}`
      : partes[0];

    const mesFormateado = new Date(`${mes}-01`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    return `💬 En ${mesFormateado} gastaste ${total.toFixed(2)}€, siendo ${listaPartes} tus mayores gastos.`;
  }, [datosAgrupados]);

  const titulos = {
    comparativa: "📊 Comparativa de tipos de gasto por mes",
    total: "💰 Gasto total mensual",
    suscripcion: "🔵 Gasto mensual en suscripciones",
    consumo: "🟣 Gasto mensual en consumos",
    unico: "🟢 Gasto mensual en gastos únicos",
  };

  return (
    
    <div className={styles.wrapper}>
      {resumenMensual && <p className={styles.resumen}>{resumenMensual}</p>}
      <h3 className={styles.titulo}>{titulos[modo]}</h3>

      <div className={styles.botones}>
        <button
          onClick={() => setModo(modos.COMPARATIVA)}
          className={`${modo === modos.COMPARATIVA ? `${styles.activo} ${styles.comparativa}` : ''}`}
        >
          Comparativa
        </button>
        <button
          onClick={() => setModo(modos.TOTAL)}
          className={`${modo === modos.TOTAL ? `${styles.activo} ${styles.total}` : ''}`}
        >
          Total
        </button>
        <button
          onClick={() => setModo(modos.SUSCRIPCION)}
          className={`${modo === modos.SUSCRIPCION ? `${styles.activo} ${styles.suscripcion}` : ''}`}
        >
          Suscripciones
        </button>
        <button
          onClick={() => setModo(modos.CONSUMO)}
          className={`${modo === modos.CONSUMO ? `${styles.activo} ${styles.consumo}` : ''}`}
        >
          Consumos
        </button>
        <button
          onClick={() => setModo(modos.UNICO)}
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