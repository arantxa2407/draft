import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// 1. Detectar la URL correcta según el dispositivo
// En Android Emulator, localhost es 10.0.2.2. En iOS es localhost.
const PC_IP = '192.168.56.1';

const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : `http://${PC_IP}:8000`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor para añadir el token a las rutas protegidas automáticamente
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;