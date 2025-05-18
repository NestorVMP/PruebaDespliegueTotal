/*import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/user/login',
        { email, password },
        { withCredentials: true } // 🔑 Importante para que se guarde la cookie
      );
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto', paddingTop: '2rem' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
*/
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const res = await axios.post(`${API_URL}/user/login`, {
      const res = await axios.post("/user/login", {
        email,
        password
      }, { withCredentials: true });

      if (res.status === 201) {
        navigate('/success');
      }
    } catch (err) {
      alert('Error en login');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
