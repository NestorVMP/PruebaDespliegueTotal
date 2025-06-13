import React from 'react';
import { useUser } from '../context/UserContext';
import PerfilUsuario from '../components/PerfilUsuario';

const Perfil = () => {
  const { userData } = useUser();

  return (
    <div style={{ padding: '1rem', marginBottom: '4rem' }}>
      <h2>Perfil de Usuario</h2>
      <PerfilUsuario user={userData} />
    </div>
  );
};

export default Perfil;
