import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaChartPie, FaCalendar, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Manejar clic fuera para cerrar el menú
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

    const handleLogout = async () => {
    try {
        // Cerrar sesión en backend (borra cookie)
        //await axios.post("http://localhost:3000/user/logout", {}, { withCredentials: true });
        await axios.post("/user/logout", {}, { withCredentials: true });
        
        // Limpiar almacenamiento local (tokens u otros datos)
        localStorage.clear();

        // Redirigir al login
        navigate('/');

        // Recargar la página (opcional, para asegurarse de estado limpio)
        window.location.reload();
    } catch (error) {
        console.error("Error cerrando sesión:", error);
        alert("Hubo un error al cerrar sesión.");
    }
    };

  return (
    <footer className="footer">
      <button className={isActive('/dashboard') ? 'active' : ''} 
      onClick={() => navigate('/dashboard')}>
        <FaHome />
        <span>Inicio</span>
      </button>
      <button className={isActive('/graficos') ? 'active' : ''}
      onClick={() => navigate('/graficos')}>
        <FaChartPie />
        <span>Gráficos</span>
      </button>
      <button className={isActive('/mensualidad') ? 'active' : ''}
       onClick={() => navigate('/mensualidad')}>
        <FaCalendar />
        <span>Mensual</span>
      </button>

        <div className="perfil-container" ref={menuRef}>
        <button
            className={isActive('/perfil') ? 'active' : ''}
            onClick={() => setShowMenu(prev => !prev)}
        >
            <FaUser />
            <span>Perfil</span>
        </button>

        {showMenu && (
            <div className="perfil-menu">
            <button onClick={() => { navigate('/perfil'); setShowMenu(false); }}>
                👤 Ver perfil
            </button>
            <button onClick={handleLogout}>🚪 Cerrar sesión</button>
            </div>
        )}
        </div>

    </footer>
  );
};

export default Footer;
