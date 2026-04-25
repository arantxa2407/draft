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

const apiClient = axios.create({
  baseURL: "http://192.168.0.154:8000",
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

export default apiClient;
