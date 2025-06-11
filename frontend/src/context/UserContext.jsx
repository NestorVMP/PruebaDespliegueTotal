import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { data, isLoading, isError, refetch } = useAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Leemos timezone del sistema o del localStorage
  const getInitialTimezone = () => {
    return localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const [timezone, setTimezone] = useState(getInitialTimezone());

  const lastDateRef = useRef(new Date().toDateString()); // solo día, sin hora

  // Guarda en localStorage cuando cambian
  useEffect(() => {
    if (userData) {
      if (userData.name) localStorage.setItem('name', userData.name);
      if (userData.preferredChart) localStorage.setItem('preferredChart', userData.preferredChart);
      if (timezone) localStorage.setItem('timezone', timezone);
    }
  }, [userData]);

  /*useEffect(() => {
    if (timezone) localStorage.setItem('timezone', timezone);
  }, [timezone]);*/

  // Rellenamos userData al iniciar desde localStorage si no viene nada
  /*useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedChart = localStorage.getItem('preferredChart');

    if (!userData && (storedName || storedChart)) {
      setUserData({
        name: storedName || '',
        preferredChart: storedChart || 'barra',
      });
    }
  }, [userData]);*/
  /*useEffect(() => {
    if (!userData) {
      const stored = localStorage.getItem('userData');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
        } catch (err) {
          console.error('❌ Error al parsear userData del localStorage:', err);
        }
      }
    }
  }, [userData]);*/
    /*useEffect(() => {
    if (!userData) {
      const stored = localStorage.getItem('userData');

      const storedName = localStorage.getItem('name');
      const storedChart = localStorage.getItem('preferredChart');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserData(parsed);
        } catch (err) {
          console.error('❌ Error al parsear userData del localStorage:', err);
        }
      }
    }
  }, [userData]);*/

  // Cuando llega data desde useAuth
  /*useEffect(() => {
    if (data) {
      setUser(data?.user);
      setUserData(prev => ({
        ...prev,
        name: data.user.name,
        preferredChart: data.user.preferredChart || 'barra', // fallback si no tiene
      }));
    }
    if (isError) {
      setUser(null);
    }
  }, [data, isError]);*/

  // Facturación automática
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await refetch();
      if (result.isError) {
        setUser(null);
        navigate('/', { replace: true });
        return;
      }

      const today = new Date().toDateString();
      if (today !== lastDateRef.current) {
        lastDateRef.current = today;
        console.log('📅 Ha cambiado el día, revisando facturas...');

        try {
          //await axios.post('http://localhost:3000/suscripcion/generar-facturas', {}, {
          await axios.post('/suscripcion/generar-facturas', {}, {
            withCredentials: true,
            headers: {
              'X-Timezone': timezone
            }
          });
          //await axios.post('http://localhost:3000/consumo/generar-facturas', {}, {
          await axios.post('/consumo/generar-facturas', {}, {
            withCredentials: true,
            headers: {
              'X-Timezone': timezone
            }
          });

          console.log('✅ Facturas revisadas con éxito.');
        } catch (err) {
          console.error('❌ Error al revisar facturas:', err);
        }
      }

    }, 60_000);

    return () => clearInterval(interval);
  }, [refetch, navigate, timezone]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isLoading,
      timezone,
      setTimezone,
      userData,
      setUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
