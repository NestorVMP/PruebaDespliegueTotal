import React, { useState } from 'react';
import axios from 'axios';
import useCategorias from '../utils/useCategorias';
import useFrecuencias from '../utils/useFrecuencias';
import { useUser } from '../context/UserContext';

const ConsumoForm = ({ onSuccess, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaInicio, setfechaInicio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [agregandoCategoria, setAgregandoCategoria] = useState(false);
  const [frecuenciaId, setFrecuenciaId] = useState('');
  const [frecuenciaNumero, setFrecuenciaNumero] = useState('');
  const [frecuenciaUnidad, setFrecuenciaUnidad] = useState('meses');
  const [agregandoFrecuencia, setAgregandoFrecuencia] = useState(false);
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const { timezone } = useUser();

  const { categorias, loading, error, refetch } = useCategorias();
  const { frecuencias, loading: loadingFrecuencias, error: errorFrecuencias, refetch: refetchFrecuencias } = useFrecuencias();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.post('http://localhost:3000/consumo/create', {
      await axios.post('/consumo/create', {
        nombre,
        monto: parseFloat(monto),
        fechaInicio,
        categoria,
        frecuencia: frecuencias.find(f => f._id === frecuenciaId),
        unidad: unidad || undefined,
        cantidad: cantidad ? parseFloat(cantidad) : undefined
      }, { withCredentials: true });
      //await axios.post('http://localhost:3000/consumo/generar-facturas', null, {
      await axios.post('/consumo/generar-facturas', null, {
        withCredentials: true,
        headers: {
          'X-Timezone': timezone
        }
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al crear el consumo');
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
      setCategoria(nombreLimpio); // Auto-seleccionar
      await refetch(); // Refrescar lista
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
      setFrecuenciaId(res.data._id);
      setAgregandoFrecuencia(false);
      setFrecuenciaNumero('');
    } catch (err) {
      console.error(err);
      alert('Error al crear la nueva frecuencia');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nuevo consumo</h3>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="date" value={fechaInicio}  onChange={(e) => setfechaInicio(e.target.value)} required />
      <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} required />
      <input type="text" placeholder="Unidad (opcional, ej: kWh)" value={unidad} onChange={(e) => setUnidad(e.target.value)} />
      <input type="number" placeholder="Cantidad (opcional)" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="0" />

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
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ConsumoForm;
