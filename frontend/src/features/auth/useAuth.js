// hooks/useAuth.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      //const res = await axios.get('http://localhost:3000/user/check-session', {
      const res = await axios.get('/user/check-session', {
        withCredentials: true
      });
      return res?.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
  });
};
