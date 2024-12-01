"use client";
import { Menu, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Box, ClipboardList, Settings, HelpCircle, FileInput } from "lucide-react";
import axios from "@/lib/api";

// ナビゲーション項目の定義
const navigationItems = [
  { name: "ダッシュボード", href: "/", icon: Home },
  { name: "在庫・発注管理", href: "/inventory-management", icon: Box },
  { name: "使用量入力", href: "/usage-input", icon: FileInput },
  { name: "設定", href: "/settings", icon: Settings },
  { name: "ヘルプ", href: "/help", icon: HelpCircle },
];

// ページごとのタイトルを定義
const pageTitles: Record<string, string> = {
  "/": "ダッシュボード",
  "/inventory-management": "在庫・発注管理",
  "/usage-input": "使用量入力",
  "/settings": "設定",
  "/help": "ヘルプ",
};

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("ゲスト");
  const pathname = usePathname(); // 現在のパスを取得

  // 現在のページのタイトルを取得
  const currentTitle = pathname && pageTitles[pathname] ? pageTitles[pathname] : "在庫管理システム";

  // 現在のページとナビゲーションリンクを比較する関数
  const isCurrentPage = (href: string) => pathname === href;

  // ユーザー名を取得する関数
  const fetchUserName = async () => {
    try {
      const response = await axios.get("/api/auth/me"); // APIエンドポイントでユーザー情報を取得
      setUsername(response.data.name || "不明なユーザー");
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
    }
  };

  // ログアウト関数
  const handleLogout = async () => {
    try {
      await axios.delete("/api/auth/logout"); // APIでログアウト
      localStorage.removeItem("authToken"); // トークンを削除
      alert("ログアウトしました");
      window.location.href = "/login"; // ログインページにリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  useEffect(() => {
    fetchUserName(); // コンポーネントマウント時にユーザー名を取得
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80 bg-white">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">メニュー</SheetTitle>
                <SheetDescription>各機能へのクイックアクセス</SheetDescription>
              </SheetHeader>
              <nav className="mt-6 flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={false}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isCurrentPage(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <span className="text-lg font-semibold text-gray-900">{currentTitle}</span>
        </div>
        <div className="text-xl font-bold text-gray-900 flex justify-center">在庫管理システム</div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-gray-700">{username}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
