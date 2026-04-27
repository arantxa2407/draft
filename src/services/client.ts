import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const getToken = async (key: string) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const setToken = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const deleteToken = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

export const clearStoredSession = async () => {
  await deleteToken("access_token");
  await deleteToken("refresh_token");
};

const apiClient = axios.create({
  baseURL: "http://192.168.0.154:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getToken("refresh_token");
        if (!refreshToken) throw new Error("No hay refresh token");

        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
        );

        const { access_token, refresh_token: newRefreshToken } = response.data;

        await setToken("access_token", access_token);
        await setToken("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await clearStoredSession();
        if (onUnauthorized) {
          onUnauthorized();
        }
        return Promise.reject("Sesión caducada. Inicia sesión de nuevo.");
      }
    }

    if (error?.response?.status === 401) {
      await clearStoredSession();

      if (onUnauthorized) {
        onUnauthorized();
      }

      return Promise.reject("Sesión caducada. Inicia sesión de nuevo.");
    }

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject(
        "El servidor tarda demasiado en responder. Inténtalo de nuevo.",
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;
