import React, { useState } from 'react';
import axios from 'axios';

const EditarGastoForm = ({ gasto, onSuccess, onClose }) => {
  const [nombre, setNombre] = useState(gasto.nombre);
  const [monto, setMonto] = useState(gasto.monto);
  const [fecha, setFecha] = useState(gasto.fecha.slice(0, 10)); // formato YYYY-MM-DD

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.put(`http://localhost:3000/gasto/update/${gasto._id}`,
      await axios.put(`/gasto/update/${gasto._id}`,
        {
          nombre,
          monto,
          fecha,
          usuario: gasto.usuario,
        },
        { withCredentials: true }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al actualizar el gasto:', err);
      alert('No se pudo actualizar el gasto.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Editar gasto</h3>

      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <label>Monto (€):</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(parseFloat(e.target.value))}
        required
      />

      <label>Fecha:</label>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

      <div style={{ marginTop: '1rem' }}>
        <button type="submit">Guardar cambios</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditarGastoForm;
