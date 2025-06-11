import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gastosReducer from '../features/gastos/gastosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gastos: gastosReducer
  }
});
