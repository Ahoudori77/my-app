"use client";

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NavigationMenuDemo from '@/components/NavigationMenu'
import Button from '@/components/Button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">在庫管理システムへようこそ</h1>
        <NavigationMenuDemo />
        <div className="mt-8">
          <Button onClick={() => console.log('クリックされました')}>
            アクションを実行
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}