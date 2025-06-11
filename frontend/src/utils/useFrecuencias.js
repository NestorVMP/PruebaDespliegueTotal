import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFrecuencias = () => {
  const [frecuencias, setFrecuencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFrecuencias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      //const response = await axios.get('http://localhost:3000/frecuencias/list', {
      const response = await axios.get('/frecuencias/list', {
        withCredentials: true,
      });
      setFrecuencias(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFrecuencias();
  }, [fetchFrecuencias]);

  return {
    frecuencias,
    loading,
    error,
    refetch: fetchFrecuencias,
  };
};

export default useFrecuencias;
