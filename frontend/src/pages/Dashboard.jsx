import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import GastoCard from '../components/GastoCard';
import Modal from '../components/Modal';
import GastoForm from '../components/GastoForm';
import SuscripcionForm from '../components/SuscripcionForm';
import ConsumoForm from '../components/ConsumoForm';
import EditarGastoForm from '../components/EditarGastoForm';
import './Dashboard.css';

const fetchGastos = async () => {
  //const res = await axios.get('http://localhost:3000/gasto/list', {
  const res = await axios.get('/gasto/list', {
    withCredentials: true,
  });
  return res.data;
};

const Dashboard = () => {
  const { userData, timezone } = useUser();
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false);
  const [isSuscripcionModalOpen, setIsSuscripcionModalOpen] = useState(false);
  const [isConsumoModalOpen, setIsConsumoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [gastoAEditar, setGastoAEditar] = useState(null);

  const { data: gastos, isLoading, error, refetch } = useQuery({
    queryKey: ['gastos'],
    queryFn: fetchGastos,
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este gasto?');
    if (!confirm) return;

    try {
      //await axios.delete(`http://localhost:3000/gasto/delete/${id}`, {
      await axios.delete(`/gasto/delete/${id}`, {
        withCredentials: true,
      });
      refetch();
    } catch (err) {
      console.error('Error al eliminar gasto:', err);
      alert('No se pudo eliminar el gasto.');
    }
  };

  const handleEdit = (gasto) => {
    setGastoAEditar(gasto);
    setIsEditModalOpen(true);
  };

  const gastosPorMes = gastos?.reduce((acc, gasto) => {
    const fecha = new Date(gasto.fecha);
    const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    acc[key] = acc[key] || [];
    acc[key].push(gasto);
    return acc;
  }, {});

  const mesesOrdenados = Object.keys(gastosPorMes || {}).sort((a, b) => b.localeCompare(a));

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-welcome">
        👋 Bienvenido, <strong>{userData?.name || localStorage.getItem('name')}</strong>
      </h2>

      <div className="dashboard-botones">
        <button className="boton boton-gasto" onClick={() => setIsGastoModalOpen(true)}>
          💸 Nuevo gasto
        </button>
        <button className="boton boton-suscripcion" onClick={() => setIsSuscripcionModalOpen(true)}>
          📅 Suscripción
        </button>
        <button className="boton boton-consumo" onClick={() => setIsConsumoModalOpen(true)}>
          ⚡ Consumo
        </button>
      </div>

      {isLoading && <p>Cargando gastos...</p>}
      {error && <p>Error al cargar los gastos</p>}

      {mesesOrdenados.map((mesClave) => {
        const gastosDelMes = gastosPorMes[mesClave];
        const totalMes = gastosDelMes.reduce((sum, g) => sum + g.monto, 0);
        const fechaMostrar = new Date(`${mesClave}-01`);
        const nombreMes = fechaMostrar.toLocaleString('es-ES', {
          month: 'long',
          year: 'numeric',
        });

        return (
          <div key={mesClave} className="dashboard-mes">
            <h3>📅 {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} – Total: {totalMes.toFixed(2)} €</h3>
            {gastosDelMes
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((gasto) => (
                <GastoCard
                  key={gasto._id}
                  gasto={gasto}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
          </div>
        );
      })}

      <Modal isOpen={isGastoModalOpen} onClose={() => setIsGastoModalOpen(false)}>
        <GastoForm onSuccess={() => refetch()} onClose={() => setIsGastoModalOpen(false)} />
      </Modal>

      <Modal isOpen={isSuscripcionModalOpen} onClose={() => setIsSuscripcionModalOpen(false)}>
        <SuscripcionForm onSuccess={() => refetch()} onClose={() => setIsSuscripcionModalOpen(false)} />
      </Modal>

      <Modal isOpen={isConsumoModalOpen} onClose={() => setIsConsumoModalOpen(false)}>
        <ConsumoForm onSuccess={() => refetch()} onClose={() => setIsConsumoModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {gastoAEditar && (
          <EditarGastoForm
            gasto={gastoAEditar}
            onSuccess={() => refetch()}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
