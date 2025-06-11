import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';


const RequireAuth = ({ children }) => {
    const { isLoading, isError } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <Navigate to="/" replace />;

    return children;
};

export default RequireAuth;