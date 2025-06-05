import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Adiciona o token de autenticação a todas as requisições quando disponível
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
