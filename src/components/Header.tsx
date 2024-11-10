"use client";

import Link from 'next/link'
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          在庫管理システム
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/dashboard" className="hover:underline">ダッシュボード</Link></li>
            <li><Link href="/inventory" className="hover:underline">在庫一覧</Link></li>
            <li><Link href="/orders" className="hover:underline">発注管理</Link></li>
            <li><UserButton afterSignOutUrl="/" /></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}