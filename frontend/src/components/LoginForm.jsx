import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config';
import './LoginForm.css';
import { useUser } from '../context/UserContext';

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { timezone, user, setUser, userData, setUserData } = useUser();

    localStorage.removeItem('name');
    localStorage.removeItem('preferredChart');
    localStorage.removeItem('timezone');

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      //const res = await axios.post(`${API_URL}/user/login`, {
      //const res = await axios.post("/user/login", { /* produccion */
      /*const res = await axios.post("http://localhost:3000/user/login", {
        email,
        password
      }, { withCredentials: true });*/

      /*const url = isRegistering
        ? 'http://localhost:3000/user/register'
        : 'http://localhost:3000/user/login';*/

      const url = isRegistering
        ? '/user/register'
        : '/user/login';

      const data = isRegistering
        ? { name, email, password }
        : { email, password };

      const res = await axios.post(url, data, { withCredentials: true });

    if (res.status === 200 || res.status === 201) {
      try {
        await axios.post('/suscripcion/generar-facturas', null, {
          withCredentials: true,
          headers: { 'X-Timezone': timezone }
        });
        await axios.post('/consumo/generar-facturas', null, {
          withCredentials: true,
          headers: { 'X-Timezone': timezone }
        });
        await axios.post('/gasto/revisar-facturas', null, {
          withCredentials: true,
          headers: { 'X-Timezone': timezone }
        });

        const userFromResponse = res.data.user;
        console.log("🟢 Login exitoso, user recibido:", userFromResponse);
        setUserData(userFromResponse);

        // 🔐 Guardar userData completo en localStorage
        //localStorage.setItem('userData', JSON.stringify(userFromResponse));
      } catch (error) {
        console.error("Error al generar facturas:", error);
      }
      navigate('/dashboard');
    }

    } catch (err) {
      alert('Error en login');
      console.error(err);
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h2>

        {isRegistering && (
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {isRegistering ? 'Registrarse' : 'Entrar'}
        </button>

        <p className="toggle-text">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <span className="toggle-link" onClick={toggleMode}>
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
