import React, { useState, useEffect } from 'react';
import styles from './PerfilUsuario.module.css';
import { Pencil } from 'lucide-react';
import axios from 'axios';
import { ejecutarResumenMensual } from '../utils/enviarResumenEmail';

const PerfilUsuario = ({ user }) => {
  const [formData, setFormData] = useState({ ...user });
  const [editMode, setEditMode] = useState({});
  const [originalData, setOriginalData] = useState({ ...user });
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setIsModified(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  const handleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      //const response = await axios.put( 'http://localhost:3000/user/update', {
      const response = await axios.put( '/user/update', {
          name: formData.name,
          email: formData.email,
          preferredChart: formData.preferredChart,
        },
        { withCredentials: true }
      );

      console.log('Respuesta:', response.data);
      setOriginalData(response.data.user);
      setFormData(response.data.user);
      setEditMode({});
      setIsModified(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err.response?.data || err.message);
      alert('Error al guardar los cambios');
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditMode({});
    setIsModified(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.item}>
        <label>Nombre:</label>
        {editMode.name ? (
          <input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        ) : (
          <span>{formData.name}</span>
        )}
        <button onClick={() => handleEdit('name')}>
          <Pencil size={16} />
        </button>
      </div>

      <div className={styles.item}>
        <label>Email:</label>
        {editMode.email ? (
          <input
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        ) : (
          <span>{formData.email}</span>
        )}
        <button onClick={() => handleEdit('email')}>
          <Pencil size={16} />
        </button>
      </div>

      <div className={styles.item}>
        <label>Tipo de gráfico preferido:</label>
        {editMode.preferredChart ? (
          <select
            value={formData.preferredChart}
            onChange={(e) => handleChange('preferredChart', e.target.value)}
          >
            <option value="none">Ninguno</option>
            <option value="barra">Barras</option>
            <option value="linea">Línea</option>
          </select>
        ) : (
          <span>{formData.preferredChart}</span>
        )}
        <button onClick={() => handleEdit('preferredChart')}>
          <Pencil size={16} />
        </button>
      </div>

      <div className={styles.item}>
        <label>Rol:</label>
        <span>{formData.role}</span>
      </div>

      {isModified && (
        <div className={styles.actions}>
          <button className={styles.cancelar} onClick={handleCancel}>
            Cancelar
          </button>
          <button className={styles.guardar} onClick={handleSave}>
            Guardar cambios
          </button>
        </div>
      )}

      {/* ✅ Nuevo botón que usa la función importada */}
      <button
        className={styles.enviarMensaje}
        onClick={() => ejecutarResumenMensual(formData)}
      >
        Enviar resumen mensual
      </button>
    </div>
  );
};

export default PerfilUsuario;
