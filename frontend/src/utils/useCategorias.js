import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      //const response = await axios.get('http://localhost:3000/categorias/list', {
      const response = await axios.get('/categorias/list', {
        withCredentials: true,
      });
      setCategorias(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return {
    categorias,
    loading,
    error,
    refetch: fetchCategorias,
  };
};

export default useCategorias;
