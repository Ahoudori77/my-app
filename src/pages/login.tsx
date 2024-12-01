"use client";
import '../app/globals.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ログイン</h2>
        <p className="text-sm text-gray-600 mb-6">アカウントにログインします。</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <Input type="email" placeholder="メールアドレスを入力" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <Input type="password" placeholder="パスワードを入力" />
          </div>
          <Button className="w-full bg-black text-white">ログイン</Button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          アカウントをお持ちでないですか？ <Link href="/register" className="text-blue-500">新規登録</Link>
        </p>
      </div>
    </div>
  );
}
