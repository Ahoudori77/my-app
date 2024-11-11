'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Menu, LogOut, Bell, AlertTriangle, ChevronUp, ChevronDown, Home, Box, ClipboardList, Settings, HelpCircle, FileInput } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
const userRole: 'office' | 'field' = 'office'
type UserRole = 'field' | 'office'

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
}

type InventoryItem = {
  id: number
  orderStatus: string
  shelfNumber: string
  attribute: string
  itemName: string
  manufacturer: string
  optimalQuantity: number
  reorderThreshold: number
  currentQuantity: number
  unit: string
}

// ナビゲーション項目の定義
const navigationItems = [
  { name: 'ダッシュボード', href: '/', icon: Home },
  { name: '在庫管理', href: '/inventory', icon: Box },
  { name: '発注管理', href: '/orders', icon: ClipboardList },
  { name: '使用量入力', href: '/usage-input', icon: FileInput },
  { name: '設定', href: '/settings', icon: Settings },
  { name: 'ヘルプ', href: '/help', icon: HelpCircle },
]

export default function Dashboard() {
  const userRole: UserRole = 'office';
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { toast } = useToast()

  // サンプルデータ
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 1,
      orderStatus: "未発注",
      shelfNumber: "A-1-1",
      attribute: "油脂類",
      itemName: "切削油",
      manufacturer: "テックオイル",
      optimalQuantity: 100,
      reorderThreshold: 20,
      currentQuantity: 15,
      unit: "L"
    },
    // 省略...
  ])

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sortedItems = [...inventoryItems].sort((a, b) => {
      if (a[key as keyof InventoryItem] < b[key as keyof InventoryItem]) return direction === 'asc' ? -1 : 1
      if (a[key as keyof InventoryItem] > b[key as keyof InventoryItem]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setInventoryItems(sortedItems)
  }

  const SortableTableHead = ({ children, sortKey }: { children: React.ReactNode, sortKey: string }) => (
    <TableHead className="cursor-pointer" onClick={() => handleSort(sortKey)}>
      <div className="flex items-center">
        {children}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </div>
    </TableHead>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>メニュー</SheetTitle>
                  <SheetDescription>各機能へのクイックアクセス</SheetDescription>
                </SheetHeader>
                <nav className="mt-6">
                  {navigationItems.map((item) => (
                    <Link key={item.name} href={item.href} className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900" onClick={() => setIsSidebarOpen(false)}>
                      <item.icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <span className="font-medium">ダッシュボード</span>
          </div>
          <div className="text-xl font-bold">在庫管理システム</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <span>山田太郎</span>
            <Button variant="ghost" size="icon"><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* ダッシュボードのコンテンツ */}
      </main>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 在庫管理システム All rights reserved.
        </div>
      </footer>
    </div>
  )
}
