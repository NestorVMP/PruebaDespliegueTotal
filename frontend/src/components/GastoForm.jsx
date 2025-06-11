/*import React, { useState } from 'react';
import axios from 'axios';

const GastoForm = ({ onSuccess, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const categorias = [ 'Comida', 'Transporte', 'Ocio', 'Salud', 'Hogar', 'Otros' ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/gasto/create', {
        nombre,
        monto: parseFloat(monto),
        fecha,
        categoria
      }, { withCredentials: true });

      onSuccess(); // Refresca la lista
      onClose();   // Cierra el modal
    } catch (err) {
      console.error(err);
      alert('Error al crear gasto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nuevo gasto</h3>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} required />
      <input type="date" value={fecha}  onChange={(e) => setFecha(e.target.value)} required />
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required >
        <option value="">-- Selecciona una categoría --</option>
        {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default GastoForm;*/

import React, { useState } from 'react';
import axios from 'axios';
import useCategorias from '../utils/useCategorias';

const GastoForm = ({ onSuccess, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [agregandoCategoria, setAgregandoCategoria] = useState(false);

  const { categorias, loading, error, refetch } = useCategorias();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.post('http://localhost:3000/gasto/create',
      await axios.post('/gasto/create',
        {
          nombre,
          monto: parseFloat(monto),
          fecha,
          categoria,
        },
        { withCredentials: true }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al crear gasto');
    }
  };

  /*const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/categorias/create',
        { nombre: nuevaCategoria },
        { withCredentials: true }
      );

      setNuevaCategoria('');
      setAgregandoCategoria(false);
      setCategoria(res.data.nombre); // Seleccionar automáticamente
      await refetch(); // Recargar categorías sin recargar la página
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la nueva categoría');
    }
  };*/
  
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
      setCategoria(nombreLimpio); // Seleccionar automáticamente
      await refetch(); // Recargar categorías sin recargar la página
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la nueva categoría');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nuevo gasto</h3>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} required />
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required disabled={loading}>
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

      <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
        Guardar
      </button>
    </form>
  );
};

export default GastoForm;
