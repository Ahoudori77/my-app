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
import { useState } from "react";
import { Home, Box, ClipboardList, Settings, HelpCircle, FileInput } from "lucide-react";

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
  const pathname = usePathname(); // 現在のパスを取得

  // 現在のページのタイトルを取得
  const currentTitle = pathname && pageTitles[pathname] ? pageTitles[pathname] : "在庫管理システム";

  // 現在のページとナビゲーションリンクを比較する関数
  const isCurrentPage = (href: string) => pathname === href;

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
          <span className="text-sm font-medium text-gray-700">山田太郎</span>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
