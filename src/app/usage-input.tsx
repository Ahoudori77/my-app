'use client'
import Header from "@/components/Header";
import Footer from "@/components/Footer"; 

import { useState, useCallback } from 'react'
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
import { Menu, LogOut, Search, Plus, Minus, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Pagination from "@/components/ui/pagination";

type UserRole = 'field' | 'office'

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
}

type SearchFilters = {
  shelfNumber: string
  attribute: string
  itemName: string
  manufacturer: string
}

type InventoryItem = {
  id: number
  name: string
  shelfNumber: string
  attribute: string
  currentQuantity: number
  optimalQuantity: number
  reorderThreshold: number
  orderStatus: string
  unit: string
}

export default function UsageInputPage({ userRole }: { userRole: UserRole }) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' })
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    shelfNumber: '',
    attribute: '',
    itemName: '',
    manufacturer: ''
  })
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([])
  const [usageInputs, setUsageInputs] = useState<Record<number, number>>({})
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const handleSort = useCallback((key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const handleSearchFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/inventory/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...searchFilters, page: currentPage, itemsPerPage }),
      })
      if (!response.ok) throw new Error('検索に失敗しました')
      const data = await response.json()
      setSearchResults(data.items)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "エラー",
        description: "検索中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchFilters, currentPage, toast])

  const handleUsageChange = useCallback((id: number, value: number) => {
    setUsageInputs(prev => ({
      ...prev,
      [id]: Math.max(0, value)
    }))
  }, [])

  const handleConfirmOpen = useCallback(() => {
    setIsConfirmDialogOpen(true)
  }, [])

  const handleConfirmClose = useCallback(() => {
    setIsConfirmDialogOpen(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch('/api/inventory/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usageInputs),
      })
      if (!response.ok) throw new Error('使用量の送信に失敗しました')
      
      // 在庫数を自動更新
      setSearchResults(prevResults => 
        prevResults.map(item => ({
          ...item,
          currentQuantity: item.currentQuantity - (usageInputs[item.id] || 0)
        }))
      )

      toast({
        title: "成功",
        description: "使用量が正常に送信され、在庫数が更新されました。",
      })
      setIsConfirmDialogOpen(false)
      setUsageInputs({})
    } catch (error) {
      console.error('Submit error:', error)
      toast({
        title: "エラー",
        description: "使用量の送信中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }, [usageInputs, toast])

  const SortableTableHead = useCallback(({ children, sortKey }: { children: React.ReactNode, sortKey: string }) => (
    <TableHead className="cursor-pointer" onClick={() => handleSort(sortKey)}>
      <div className="flex items-center">
        {children}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </div>
    </TableHead>
  ), [sortConfig, handleSort])


  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
<Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 検索フィルター */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>アイテム検索</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="shelf-number">棚番</Label>
                <Input
                  id="shelf-number"
                  placeholder="棚番を入力"
                  value={searchFilters.shelfNumber}
                  onChange={(e) => handleSearchFilterChange('shelfNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="attribute">属性</Label>
                <Select value={searchFilters.attribute} onValueChange={(value) => handleSearchFilterChange('attribute', value)}>
                  <SelectTrigger id="attribute">
                    <SelectValue placeholder="属性を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oil">油脂類</SelectItem>
                    <SelectItem value="drill">ドリル類</SelectItem>
                    <SelectItem value="cutting">切削工具</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="item-name">アイテム名</Label>
                <Input
                  id="item-name"
                  placeholder="アイテム名を入力"
                  value={searchFilters.itemName}
                  onChange={(e) => handleSearchFilterChange('itemName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">メーカー名</Label>
                <Input
                  id="manufacturer"
                  placeholder="メーカー名を入力"
                  value={searchFilters.manufacturer}
                  onChange={(e) => handleSearchFilterChange('manufacturer', e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? "検索中..." : <><Search className="mr-2 h-4 w-4" /> 検索</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 現在の検索条件 */}
        <Card className="mb-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">現在の検索条件:</h3>
            <ul className="list-disc list-inside">
              {searchFilters.shelfNumber && <li>棚番: {searchFilters.shelfNumber}</li>}
              {searchFilters.attribute && <li>属性: {searchFilters.attribute}</li>}
              {searchFilters.itemName && <li>アイテム名: {searchFilters.itemName}</li>}
              {searchFilters.manufacturer && <li>メーカー名: {searchFilters.manufacturer}</li>}
            </ul>
          </CardContent>
        </Card>

        {/* 検索結果と使用量入力 */}
        <Card>
          <CardHeader>
            <CardTitle>使用量入力</CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold">検索結果: {searchResults.length}件</p>
              </div>
            )}
            {searchResults.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead sortKey="orderStatus">発注状況</SortableTableHead>
                      <SortableTableHead sortKey="name">アイテム名</SortableTableHead>
                      <SortableTableHead sortKey="shelfNumber">棚番</SortableTableHead>
                      <SortableTableHead sortKey="attribute">属性</SortableTableHead>
                      <TableHead className="text-right">適正在庫数</TableHead>
                      <TableHead className="text-right">発注基準数</TableHead>
                      <SortableTableHead sortKey="currentQuantity">現在の在庫数</SortableTableHead>
                      <TableHead className="text-right">使用量</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant={item.orderStatus === "発注中" ? "secondary" : "destructive"}>
                            {item.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.shelfNumber}</TableCell>
                        <TableCell>{item.attribute}</TableCell>
                        <TableCell className="text-right">{item.optimalQuantity} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.reorderThreshold} {item.unit}</TableCell>
                        <TableCell className="text-right">
                          <span className={item.currentQuantity <= item.reorderThreshold ? "text-red-600 font-medium" : ""}>
                            {item.currentQuantity} {item.unit}
                          </span>
                          {item.currentQuantity <= item.reorderThreshold && (
                            <AlertTriangle className="inline ml-2 h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUsageChange(item.id, (usageInputs[item.id] || 0) - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={usageInputs[item.id] || ''}
                              onChange={(e) => handleUsageChange(item.id, parseInt(e.target.value) || 0)}
                              className="w-20 text-right"
                            />
                            <span className="ml-2">{item.unit}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUsageChange(item.id, (usageInputs[item.id] || 0) + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>検索結果がありません。検索条件を変更してお試しください。</p>
                <p className="mt-2">
                  検索条件: 
                  {searchFilters.shelfNumber && `棚番: ${searchFilters.shelfNumber}, `}
                  {searchFilters.attribute && `属性: ${searchFilters.attribute}, `}
                  {searchFilters.itemName && `アイテム名: ${searchFilters.itemName}, `}
                  {searchFilters.manufacturer && `メーカー名: ${searchFilters.manufacturer}`}
                </p>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleConfirmOpen}>使用量を確認</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ページネーション */}
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* 確認ダイアログ */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>使用量の確認</DialogTitle>
              <DialogDescription>
                以下の使用量を送信します。内容を確認してください。
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アイテム名</TableHead>
                  <TableHead>使用量</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.filter(item => usageInputs[item.id] > 0).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{usageInputs[item.id]} {item.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <Button variant="outline" onClick={handleConfirmClose}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit}>送信</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  )
}