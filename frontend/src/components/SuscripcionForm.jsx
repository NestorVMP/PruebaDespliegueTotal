/*import React, { useState } from 'react';
import axios from 'axios';
import useCategorias from '../utils/useCategorias';

const SuscripcionForm = ({ onSuccess, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [agregandoCategoria, setAgregandoCategoria] = useState(false);

  const [frecuencia, setFrecuencia] = useState('');
  const frecuencias = ['mensual', 'anual'];

  const { categorias, loading, error, refetch } = useCategorias();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/suscripcion/create', {
        nombre,
        monto: parseFloat(monto),
        fechaInicio,
        categoria,
        frecuencia
      }, { withCredentials: true });

      await axios.post('http://localhost:3000/suscripcion/generar-facturas', null, {
        withCredentials: true,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al crear suscripción');
    }
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    const nombreLimpio = nuevaCategoria.trim();

    try {
      const res = await axios.post(
        'http://localhost:3000/categorias/create',
        { nombre: nombreLimpio },
        { withCredentials: true }
      );

      setAgregandoCategoria(false);
      setNuevaCategoria('');
      setCategoria(nombreLimpio);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la nueva categoría');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nueva suscripción</h3>

      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} required />
      <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />

      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required disabled={loading} >
        <option value="">-- Selecciona una categoría --</option>
        {categorias.map((cat) => (
          <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
        ))}
      </select>

      <div style={{ marginTop: '0.5rem' }}>
        {!agregandoCategoria ? (
          <button type="button" onClick={() => setAgregandoCategoria(true)}>
            + Añadir nueva categoría
          </button>
        ) : (
          <div style={{ marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="Nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button type="button" onClick={handleCrearCategoria} style={{ marginLeft: '0.5rem' }}>
              Crear
            </button>
            <button
              type="button"
              onClick={() => {
                setAgregandoCategoria(false);
                setNuevaCategoria('');
              }}
              style={{ marginLeft: '0.5rem' }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <select
        value={frecuencia}
        onChange={(e) => setFrecuencia(e.target.value)}
        required
      >
        <option value="">-- Selecciona una frecuencia --</option>
        {frecuencias.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
        Guardar
      </button>
    </form>
  );
};

export default SuscripcionForm;*/

import React, { useState } from 'react';
import axios from 'axios';
import useCategorias from '../utils/useCategorias';
import useFrecuencias from '../utils/useFrecuencias';
import { useUser } from '../context/UserContext';

const SuscripcionForm = ({ onSuccess, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [agregandoCategoria, setAgregandoCategoria] = useState(false);

  const [frecuenciaId, setFrecuenciaId] = useState('');
  const [frecuenciaNumero, setFrecuenciaNumero] = useState('');
  const [frecuenciaUnidad, setFrecuenciaUnidad] = useState('meses');
  const [agregandoFrecuencia, setAgregandoFrecuencia] = useState(false);

  const { categorias, loading, error, refetch } = useCategorias();
  const { frecuencias, loading: loadingFrecuencias, error: errorFrecuencias, refetch: refetchFrecuencias } = useFrecuencias();
  const { timezone } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.post('http://localhost:3000/suscripcion/create', {
      await axios.post('/suscripcion/create', {
        nombre,
        monto: parseFloat(monto),
        fechaInicio,
        categoria,
        //frecuencia: frecuenciaId
        frecuencia: frecuencias.find(f => f._id === frecuenciaId)
      }, { withCredentials: true });

      //await axios.post('http://localhost:3000/suscripcion/generar-facturas', null, {
      await axios.post('/suscripcion/generar-facturas', null, {
        withCredentials: true,
        headers: {
          'X-Timezone': timezone
        }
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al crear suscripción');
    }
  };

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    const nombreLimpio = nuevaCategoria.trim();

    try {
      //const res = await axios.post('http://localhost:3000/categorias/create',
      const res = await axios.post('/categorias/create',
        { nombre: nombreLimpio },
        { withCredentials: true }
      );

      setAgregandoCategoria(false);
      setNuevaCategoria('');
      setCategoria(nombreLimpio);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la nueva categoría');
    }
  };

  const handleCrearFrecuencia = async () => {
    if (!frecuenciaNumero || isNaN(frecuenciaNumero)) return;

    try {
      //const res = await axios.post('http://localhost:3000/frecuencias/create',
      const res = await axios.post('/frecuencias/create',
        {
          frecuenciaNumero: parseInt(frecuenciaNumero),
          frecuenciaUnidad
        },
        { withCredentials: true }
      );

      await refetchFrecuencias();
      setFrecuenciaId(res.data._id); // seleccionar automáticamente
      setAgregandoFrecuencia(false);
      setFrecuenciaNumero('');
    } catch (err) {
      console.error(err);
      alert('Error al crear la nueva frecuencia');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nueva suscripción</h3>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} required />
      <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />

      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required disabled={loading} >
        <option value="">-- Selecciona una categoría --</option>
        {categorias.map((cat) => (
          <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
        ))}
      </select>

      <div style={{ marginTop: '0.5rem' }}>
        {!agregandoCategoria ? (
          <button type="button" onClick={() => setAgregandoCategoria(true)}>
            + Añadir nueva categoría
          </button>
        ) : (
          <div style={{ marginTop: '0.5rem' }}>
            <input type="text" placeholder="Nueva categoría" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} />
            <button type="button" onClick={handleCrearCategoria} style={{ marginLeft: '0.5rem' }}>
              Crear
            </button>
            <button type="button" onClick={() => { 
                setAgregandoCategoria(false);
                setNuevaCategoria(''); }}
              style={{ marginLeft: '0.5rem' }} >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <select value={frecuenciaId} onChange={(e) => setFrecuenciaId(e.target.value)} required disabled={loadingFrecuencias} >
        <option value="">-- Selecciona una frecuencia --</option>
        <option value="">-- Selecciona una categoría --</option>
        {frecuencias.map((f) => (
          <option key={f._id} value={f._id}>{`${f.frecuenciaNumero} ${f.frecuenciaUnidad}`}</option>
        ))}
      </select>

      <div style={{ marginTop: '0.5rem' }}>
        {!agregandoFrecuencia ? (
          <button type="button" onClick={() => setAgregandoFrecuencia(true)}>
            + Añadir nueva frecuencia
          </button>
        ) : (
          <div style={{ marginTop: '0.5rem' }}>
            <input type="number" placeholder="Número" value={frecuenciaNumero} onChange={(e) => setFrecuenciaNumero(e.target.value)} min={1} style={{ width: '5rem' }} />
            <select value={frecuenciaUnidad} onChange={(e) => setFrecuenciaUnidad(e.target.value)} style={{ marginLeft: '0.5rem' }} >
              <option value="dias">días</option>
              <option value="semanas">semanas</option>
              <option value="meses">meses</option>
              <option value="años">años</option>
            </select>
            <button type="button" onClick={handleCrearFrecuencia} style={{ marginLeft: '0.5rem' }}>
              Crear
            </button>
            <button type="button" onClick={() => {
              setAgregandoFrecuencia(false);
              setFrecuenciaNumero('');
            }} style={{ marginLeft: '0.5rem' }} >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
        Guardar
      </button>
    </form>
  );
};

export default SuscripcionForm;