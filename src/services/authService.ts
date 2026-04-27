import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import apiClient from "./client";

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

export const authService = {
  register: async (name: string, email: string, pass: string) => {
    try {
      const response = await apiClient.post("/auth/register", {
        username: name,
        email,
        password: pass,
      });

      if (response.data.access_token) {
        await setToken("access_token", response.data.access_token);
        await setToken("refresh_token", response.data.refresh_token);
      }

      return response.data;
    } catch (error: any) {
      console.error("Error en el registro:", error);
      throw error.response?.data?.detail || "Error al crear la cuenta";
    }
  },

  login: async (email: string, pass: string) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password: pass,
      });

      if (response.data.access_token) {
        await setToken("access_token", response.data.access_token);
        await setToken("refresh_token", response.data.refresh_token);
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Credenciales incorrectas";
    }
  },

  verify: async () => {
    try {
      const response = await apiClient.get("/auth/verify");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || "Sesión caducada";
    }
  },

  refresh: async () => {
    try {
      const refreshToken = await getToken("refresh_token");
      if (!refreshToken) throw new Error("No hay refresh token");

      const response = await apiClient.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      await setToken("access_token", access_token);
      await setToken("refresh_token", newRefreshToken);

      return access_token;
    } catch (error) {
      await deleteToken("access_token");
      await deleteToken("refresh_token");
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      await deleteToken("access_token");
      await deleteToken("refresh_token");
    }
  },

  deleteAccount: async () => {
    try {
      await apiClient.delete("/auth/delete");
    } finally {
      await deleteToken("access_token");
      await deleteToken("refresh_token");
    }
  },
};
