import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoLineas from '../components/GraficoComparativo';
import GraficoBarraSimple from '../components/GraficoBarraSimple';
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';
import styles from './Graficos.module.css';

const fetchGastos = async () => {
  //const res = await axios.get('http://localhost:3000/gasto/list', {
  const res = await axios.get('/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { userData, setUserData } = useUser();
  const [selectedChart, setSelectedChart] = useState('');

  useEffect(() => {
    const preferred = userData?.preferredChart || localStorage.getItem('preferredChart') || 'barra';
    setSelectedChart(preferred);
  }, [userData]);

  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const guardarPreferencia = async () => {
    const nuevoValor = userData?.preferredChart === selectedChart ? 'none' : selectedChart;
    try {
      //const res = await axios.put('http://localhost:3000/user/update',
      const res = await axios.put('/user/update',
        { preferredChart: nuevoValor },
        { withCredentials: true }
      );
      setUserData(res.data.user);
      localStorage.setItem('preferredChart', nuevoValor ?? '');
    } catch (err) {
      console.error('❌ Error al guardar preferencia:', err);
      alert('Error al guardar preferencia ❌');
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'barra':
        return <GraficoBarraSimple gastos={gastos} />;
      case 'linea':
        return <GraficoLineas gastos={gastos} />;
      default:
        return <GraficoBarraSimple gastos={gastos} />;
    }
  };

  if (isLoading) return <p className={styles.loading}>Cargando mensualidades...</p>;
  if (error) return <p className={styles.error}>Error al cargar mensualidades</p>;

  const preferido = userData?.preferredChart || localStorage.getItem('preferredChart');

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>📊 Gráficos de gastos mensuales</h2>

      <div className={styles.controles}>
        <label htmlFor="grafico-select">Gráfico:</label>
        <div className={styles.selectGroup}>
          <select
            id="grafico-select"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className={styles.selector}
          >
            <option value="barra">Barras</option>
            <option value="linea">Líneas</option>
          </select>

          <FaStar
            className={`${styles.estrella} ${preferido === selectedChart ? styles.activa : ''}`}
            title="Guardar como preferido"
            onClick={guardarPreferencia}
          />
        </div>
      </div>

      <div className={styles.graficoFull}>
        {renderChart()}
      </div>

    </div>
  );
};

export default Graficos;
