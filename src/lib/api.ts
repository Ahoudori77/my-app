import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// リクエストインターセプターでJWTを設定
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;