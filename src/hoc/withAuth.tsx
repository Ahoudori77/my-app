"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/login"); // ログイン画面にリダイレクト
      }
    }, [router]);

    return <Component {...props} />;
  };
}