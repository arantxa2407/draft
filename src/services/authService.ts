import apiClient from './client';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  // Registro: Mapeamos 'name' del front a 'username' del back
  register: async (name: string, email: string, pass: string) => {
    try {
      const response = await apiClient.post('/auth/register', {
        username: name,
        email: email,
        password: pass
      });
      
      // Guardamos los tokens que nos devuelve el back
      if (response.data.access_token) {
        await SecureStore.setItemAsync('access_token', response.data.access_token);
        await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);
      }
      return response.data;
    } catch (error: any) {
      // Extraemos el error que configuraste en FastAPI (HTTPException)
      throw error.response?.data?.detail || "Error al crear la cuenta";
    }
  },

  login: async (email: string, pass: string) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password: pass
      });
      if (response.data.access_token) {
        await SecureStore.setItemAsync('access_token', response.data.access_token);
        await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Credenciales incorrectas";
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Siempre borramos los tokens del móvil
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
    }
  }
};