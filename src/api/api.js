// src/api.js
import axios from 'axios';

// ベースとなるURLの設定
const api = axios.create({
  baseURL: 'http://localhost:3001', // RailsサーバーなどのバックエンドのURLに変更してください
  timeout: 5000, // タイムアウト設定（ミリ秒）
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
