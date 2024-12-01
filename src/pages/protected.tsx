import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Protected({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // useRouter を使用

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        router.push("/login"); // ログイン画面にリダイレクト
      } finally {
        setIsLoading(false); // ロード状態を解除
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (!user) {
    return null; // ユーザーがいない場合は何も表示しない（リダイレクトされるため）
  }

  return <>{children}</>;
}
