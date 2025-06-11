/*import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from "../components/GraficoComparativo";
import GraficoBarraSimple from "../components/GraficoBarraSimple";


const fetchGastos = async () => {
  const res = await axios.get('http://localhost:3000/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });


  if (isLoading) return <p>Cargando mensualidades...</p>;
  if (error) return <p>Error al cargar mensualidades</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Gráficos de gastos mensuales</h2>
      //{/* <GraficoMensualidad gastos={gastos} /> aqui falta cerrar * con el /}
      <GraficoComparativo gastos={gastos} />
      <GraficoBarraSimple gastos={gastos} />
    </div>
  );
};

export default Graficos;*/

/*import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from "../components/GraficoComparativo";
import GraficoBarraSimple from "../components/GraficoBarraSimple";
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';

const fetchGastos = async () => {
  const res = await axios.get('http://localhost:3000/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { user, preferredChart, setUser } = useUser();
  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const [selectedChart, setSelectedChart] = useState(preferredChart);

  // Sincroniza con la preferencia del usuario al cargar
  useEffect(() => {
    if (preferredChart) setSelectedChart(preferredChart);
  }, [preferredChart]);

  const guardarPreferencia = async () => {
    try {
      const res = await axios.put('http://localhost:3000/user/update', {
        preferredChart: selectedChart
      }, { withCredentials: true });

      setUser(res.data.user); // actualizamos el usuario en el contexto
      alert("Preferencia guardada ✅");
    } catch (err) {
      console.error("Error al guardar preferencia:", err);
      alert("Error al guardar preferencia ❌");
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'barra':
        return <GraficoBarraSimple gastos={gastos} />;
      case 'linea':
        return <GraficoComparativo gastos={gastos} />;
      default:
        return <p>No hay gráfico seleccionado</p>;
    }
  };

  if (isLoading) return <p>Cargando mensualidades...</p>;
  if (error) return <p>Error al cargar mensualidades</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Gráficos de gastos mensuales</h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label htmlFor="grafico-select">Selecciona gráfico:</label>
        <select
          id="grafico-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="linea">Gráfico de líneas</option>
        </select>

        <FaStar
          size={20}
          style={{ cursor: 'pointer', color: preferredChart === selectedChart ? 'gold' : 'gray' }}
          title="Guardar como preferido"
          onClick={guardarPreferencia}
        />
      </div>

      {renderChart()}
    </div>
  );
};

export default Graficos;*/

/*import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from "../components/GraficoComparativo";
import GraficoBarraSimple from "../components/GraficoBarraSimple";
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';

const fetchGastos = async () => {
  const res = await axios.get('http://localhost:3000/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { userData, setUserData } = useUser();
  console.log("🟠 userData desde contexto:", userData);
  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const [selectedChart, setSelectedChart] = useState('barra'); // valor por defecto

  // Setear el gráfico favorito si existe cuando cargue userData
  useEffect(() => {
    console.log("🔵 Efecto ejecutado - userData.preferredChart:", userData?.preferredChart);
    if (userData?.preferredChart) {
      setSelectedChart(userData.preferredChart);
    }
  }, [userData]);


  const guardarPreferencia = async () => {
    try {
      const res = await axios.put(
        'http://localhost:3000/user/update',
        { preferredChart: selectedChart },
        { withCredentials: true }
      );
      console.log("⭐ Guardando preferencia:", selectedChart);
      setUserData(res.data.user); // actualiza el contexto global
      console.log("⭐ Preferencia guardada en userData:", res.data.user);
      alert("Preferencia guardada ✅");
    } catch (err) {
      console.error("Error al guardar preferencia:", err);
      alert("Error al guardar preferencia ❌");
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'barra':
        return <GraficoBarraSimple gastos={gastos} />;
      case 'linea':
        return <GraficoComparativo gastos={gastos} />;
      default:
        return <p>No hay gráfico seleccionado</p>;
    }
  };

  if (isLoading) return <p>Cargando mensualidades...</p>;
  if (error) return <p>Error al cargar mensualidades</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Gráficos de gastos mensuales</h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label htmlFor="grafico-select">Selecciona gráfico:</label>
        <select
          id="grafico-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="linea">Gráfico de líneas</option>
        </select>

        <FaStar
          size={20}
          style={{
            cursor: 'pointer',
            color: userData?.preferredChart === selectedChart ? 'gold' : 'gray',
          }}
          title="Guardar como preferido"
          onClick={guardarPreferencia}
        />
      </div>

      {renderChart()}
    </div>
  );
};

export default Graficos;*/

/*import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from "../components/GraficoComparativo";
import GraficoBarraSimple from "../components/GraficoBarraSimple";
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';

const fetchGastos = async () => {
  const res = await axios.get('http://localhost:3000/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { userData, setUserData, timezone } = useUser();

  useEffect(() => {
    console.log('🔍 localStorage name:', localStorage.getItem('name'));
    console.log('🔍 localStorage preferredChart:', localStorage.getItem('preferredChart'));
    console.log('🔍 localStorage timezone:', localStorage.getItem('timezone'));    
    console.log("🟠 userData desde contexto:", userData);
    console.log('timezone:', timezone);
  }, []);

  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const [selectedChart, setSelectedChart] = useState('barra'); // valor por defecto

  // Setear el gráfico favorito si existe cuando cargue userData
  useEffect(() => {
    console.log("🔵 Efecto ejecutado - userData.preferredChart:", userData?.preferredChart);
    if (!userData?.preferredChart) {
      const storedChart = localStorage.getItem('preferredChart');
      if (storedChart) {
        setSelectedChart(storedChart);
        console.log("📦 Preferencia cargada desde localStorage:", storedChart);
      }
    }
  }, []);

  useEffect(() => {
    // Siempre que cambie el gráfico seleccionado, lo guardamos localmente
    localStorage.setItem('preferredChart', selectedChart);
  }, [selectedChart]);

  const guardarPreferencia = async () => {
    try {
      const res = await axios.put(
        'http://localhost:3000/user/update',
        { preferredChart: selectedChart },
        { withCredentials: true }
      );
      console.log("⭐ Guardando preferencia:", selectedChart);
      setUserData(res.data.user); // actualiza el contexto global
      console.log("⭐ Preferencia guardada en userData:", res.data.user);
      alert("Preferencia guardada ✅");
    } catch (err) {
      console.error("Error al guardar preferencia:", err);
      alert("Error al guardar preferencia ❌");
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'barra':
        return <GraficoBarraSimple gastos={gastos} />;
      case 'linea':
        return <GraficoComparativo gastos={gastos} />;
      default:
        return <p>No hay gráfico seleccionado</p>;
    }
  };

  if (isLoading) return <p>Cargando mensualidades...</p>;
  if (error) return <p>Error al cargar mensualidades</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Gráficos de gastos mensuales</h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label htmlFor="grafico-select">Selecciona gráfico:</label>
        <select
          id="grafico-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="linea">Gráfico de líneas</option>
        </select>

        <FaStar
          size={20}
          style={{
            cursor: 'pointer',
            color: userData?.preferredChart === selectedChart ? 'gold' : 'gray',
          }}
          title="Guardar como preferido"
          onClick={guardarPreferencia}
        />
      </div>

      {renderChart()}
    </div>
  );
};

export default Graficos;*/

/*import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from "../components/GraficoComparativo";
import GraficoBarraSimple from "../components/GraficoBarraSimple";
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';

const fetchGastos = async () => {
  const res = await axios.get('http://localhost:3000/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { userData, setUserData, timezone } = useUser();

  const [selectedChart, setSelectedChart] = useState(''); // se inicializa vacío

  // 🧠 Setear gráfico preferido en el primer render
  useEffect(() => {
    const preferred = userData?.preferredChart || localStorage.getItem('preferredChart') || 'barra';
    setSelectedChart(preferred);
    console.log("🔁 Cargando gráfico preferido:", preferred);
  }, [userData]);

  // 🧠 Guardar en localStorage cada vez que cambia
  useEffect(() => {
    if (selectedChart) {
      localStorage.setItem('preferredChart', selectedChart);
    }
  }, [selectedChart]);

  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const guardarPreferencia = async () => {
    try {
      const res = await axios.put(
        'http://localhost:3000/user/update',
        { preferredChart: selectedChart },
        { withCredentials: true }
      );
      setUserData(res.data.user);
      console.log("✅ Preferencia guardada:", selectedChart);
      alert("Preferencia guardada ✅");
    } catch (err) {
      console.error("❌ Error al guardar preferencia:", err);
      alert("Error al guardar preferencia ❌");
    }
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'barra':
        return <GraficoBarraSimple gastos={gastos} />;
      case 'linea':
        return <GraficoComparativo gastos={gastos} />;
      default:
        return <p>No hay gráfico seleccionado</p>;
    }
  };

  if (isLoading) return <p>Cargando mensualidades...</p>;
  if (error) return <p>Error al cargar mensualidades</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Gráficos de gastos mensuales</h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label htmlFor="grafico-select">Selecciona gráfico:</label>
        <select
          id="grafico-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="linea">Gráfico de líneas</option>
        </select>

        <FaStar
          size={20}
          style={{
            cursor: 'pointer',
            color: userData?.preferredChart === selectedChart ? 'gold' : 'gray',
          }}
          title="Guardar como preferido"
          onClick={guardarPreferencia}
        />
      </div>

      {renderChart()}
    </div>
  );
};

export default Graficos;*/

/*import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from '../components/GraficoComparativo';
import GraficoBarraSimple from '../components/GraficoBarraSimple';
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';

const fetchGastos = async () => {
  const res = await axios.get('http://localhost:3000/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Graficos = () => {
  const { userData, setUserData } = useUser();
  const [selectedChart, setSelectedChart] = useState('');

  // Inicializar gráfico seleccionado
  useEffect(() => {
    const preferred = userData?.preferredChart || localStorage.getItem('preferredChart') || 'barra';
    setSelectedChart(preferred);
    console.log('🎯 Gráfico seleccionado al cargar:', preferred);
  }, [userData]);

  const { data: gastos, isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const guardarPreferencia = async () => {
    const nuevoValor = userData?.preferredChart === selectedChart ? 'none' : selectedChart;

    try {
      const res = await axios.put(
        'http://localhost:3000/user/update',
        { preferredChart: nuevoValor },
        { withCredentials: true }
      );
      setUserData(res.data.user);
      localStorage.setItem('preferredChart', nuevoValor ?? '');
      alert(nuevoValor ? 'Preferencia guardada ✅' : 'Preferencia eliminada ❌');
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
        return <GraficoComparativo gastos={gastos} />;
      default:
        return <GraficoBarraSimple gastos={gastos} />;
    }
  };

  if (isLoading) return <p>Cargando mensualidades...</p>;
  if (error) return <p>Error al cargar mensualidades</p>;

  const preferido = userData?.preferredChart || localStorage.getItem('preferredChart');

  console.log('preferido', preferido);
  console.log('selectedChart', selectedChart);
  
  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Gráficos de gastos mensuales</h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label htmlFor="grafico-select">Selecciona gráfico:</label>
        <select
          id="grafico-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="linea">Gráfico de líneas</option>
        </select>

        <FaStar
          size={20}
          style={{
            cursor: 'pointer',
            //color: preferido === selectedChart ? 'gold' : 'gray',
            color: preferido === 'none' ? 'gray' : (preferido === selectedChart ? 'gold' : 'gray')

          }}
          title="Guardar como preferido"
          onClick={guardarPreferencia}
        />
      </div>

      {renderChart()}
    </div>
  );
};

export default Graficos;*/

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GraficoMensualidad from '../components/GraficoMensualidad';
import GraficoComparativo from '../components/GraficoComparativo';
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
        return <GraficoComparativo gastos={gastos} />;
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

      {/* <div className={styles.controles}>
        <label htmlFor="grafico-select">Selecciona gráfico:</label>
        <select
          id="grafico-select"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
          className={styles.selector}
        >
          <option value="barra">Gráfico de barras</option>
          <option value="linea">Gráfico de líneas</option>
        </select>

        <FaStar
          className={`${styles.estrella} ${preferido === selectedChart ? styles.activa : ''}`}
          title="Guardar como preferido"
          onClick={guardarPreferencia}
        />
      </div> */}

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

      {/* <div className={styles.grafico}>
        {renderChart()}
      </div> */}
      <div className={styles.graficoFull}>
        {renderChart()}
      </div>

    </div>
  );
};

export default Graficos;
