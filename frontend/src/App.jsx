/*import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SuccessPage from './components/SuccessPage';
import Dashboard from './pages/Dashboard';
import Mensualidad from './pages/Mensualidad';
import RequireAuth from './components/RequireAuth';
import Graficos from './pages/Graficos';

const App = () => {
  return (
    <Routes>
      // Rutas públicas 
      <Route path="/" element={<LoginForm />} />
      <Route path="/success" element={<SuccessPage />} />

      // Rutas privadas 
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/mensualidad"
        element={
          <RequireAuth>
            <Mensualidad />
          </RequireAuth>
        }
      />
      <Route
        path="/graficos"
        element={
          <RequireAuth>
            <Graficos />
          </RequireAuth>
        }
      />

      // Redirección por defecto
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;*/

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SuccessPage from './components/SuccessPage';
import Dashboard from './pages/Dashboard';
import Mensualidad from './pages/Mensualidad';
import RequireAuth from './components/RequireAuth';
import Graficos from './pages/Graficos';
import Layout from './components/Layout';
import Perfil from './pages/Perfil';

const App = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/success" element={<SuccessPage />} />

      {/* Rutas privadas */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/mensualidad"
        element={
          <RequireAuth>
            <Layout>
              <Mensualidad />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/graficos"
        element={
          <RequireAuth>
            <Layout>
              <Graficos />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/perfil"
        element={
          <RequireAuth>
            <Layout>
              <Perfil />
            </Layout>
          </RequireAuth>
        }
      />


      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
