import axios from "axios";

export const fetchCsrfToken = async (): Promise<string> => {
  try {
    const response = await axios.get("/api/auth/csrf-token", {
      baseURL: "http://localhost:3001", // RailsサーバーURL
      withCredentials: true, // クッキーを含める
    });
    return response.data.csrfToken; // 正しいトークンを返す
  } catch (error) {
    console.error("CSRFトークンの取得に失敗しました:", error);
    throw error;
  }
};