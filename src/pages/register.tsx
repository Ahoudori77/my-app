"use client";
import '../app/globals.css';

import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Link from "next/link";
import api from "@/lib/api"; // APIクライアントをインポート

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrorMessage("パスワードが一致しません");
      return;
    }

    try {
      await api.post("/users/sign_up", {
        user: {
          name: username,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role,
        },
      });
      alert("登録が成功しました");
      router.push("/login"); // ログインページにリダイレクト
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "登録に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ユーザー登録</h2>
        <p className="text-sm text-gray-600 mb-6">新しいアカウントを作成します。</p>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">ユーザー名</label>
            <Input
              type="text"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
            <Input
              type="password"
              placeholder="パスワードを再入力"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">役割</label>
            <Select onValueChange={(value) => setRole(value)} value={role}>
              <SelectTrigger>
                <SelectValue placeholder="役割を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="user">一般ユーザー</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-black text-white">登録</Button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          既にアカウントをお持ちですか？ <Link href="/login" className="text-blue-500">ログイン</Link>
        </p>
      </div>
    </div>
  );
}
