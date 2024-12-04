"use client";
import '../app/globals.css';
import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api"; // Axiosインスタンスをインポート

export default function Login() {
  const [email, setEmail] = useState(""); // メールアドレスの状態
  const [password, setPassword] = useState(""); // パスワードの状態
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージの状態
  const router = useRouter(); // ルーターを使用

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post("/api/users/sign_in", {
        user: {
          email,
          password,
        },
      });
  
      const { jwt } = response.data;
  
      // トークンをローカルストレージに保存
      localStorage.setItem("jwtToken", jwt);
  
      alert("ログイン成功");
      router.push("/dashboard"); // ダッシュボードにリダイレクト
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "ログインに失敗しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ログイン</h2>
        <p className="text-sm text-gray-600 mb-6">アカウントにログインします。</p>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <Input
              type="email"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <Input
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-black text-white">ログイン</Button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          アカウントをお持ちでないですか？ <Link href="/register" className="text-blue-500">新規登録</Link>
        </p>
      </div>
    </div>
  );
}
