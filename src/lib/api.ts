// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchInventoryItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/inventory`);
  return response.data;
};

export const placeOrder = async (itemId: number) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, { itemId });
  return response.data;
};

export const updateInventoryItem = async (itemId: number, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/inventory/${itemId}`, data);
  return response.data;
};

const api = axios.create({
  baseURL: "http://localhost:3001/api", // バックエンドのURL
});

// リクエスト時にヘッダーにトークンを追加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;