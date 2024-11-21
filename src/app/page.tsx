'use client';
import '../styles/globals.css';
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import SortableTableHead from "@/components/ui/SortableTableHead";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

type InventoryItem = {
  id: number;
  name: string;
  manufacturer?: string;
  optimal_quantity: number;
  reorder_threshold: number;
  current_quantity: number;
  unit: string;
  shelfNumber: string;
  attribute: string;
};

type ApiResponse = {
  items: InventoryItem[];
  total_items: number;
};

export default function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [searchParams, setSearchParams] = useState({
    shelfNumber: '',
    attribute: '',
    name: '',
    manufacturer: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse>("http://localhost:3001/api/inventory/items", {
        params: {
          page: currentPage,
          perPage: itemsPerPage,
          sortField: sortConfig.key,
          sortOrder: sortConfig.direction,
          ...searchParams,
        },
      });

      setInventoryItems(response.data.items);
      setTotalItems(response.data.total_items);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, sortConfig, searchParams]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1); // 検索時はページをリセット
    fetchData();
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
        {/* 検索フィルター */}
        <Card className="mb-8 p-4 shadow-sm border rounded-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="棚番"
                value={searchParams.shelfNumber}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, shelfNumber: e.target.value }))
                }
                className="w-full"
              />
              <Select
                onValueChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, attribute: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="属性" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
                  <SelectItem value="oil">油脂類</SelectItem>
                  <SelectItem value="drill">ドリル類</SelectItem>
                  <SelectItem value="cutting">切削工具</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="アイテム名"
                value={searchParams.name}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full"
              />
              <Select
                onValueChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, manufacturer: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="メーカー名" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
                  <SelectItem value="tech-oil">テックオイル</SelectItem>
                  <SelectItem value="tool-tech">ツールテック</SelectItem>
                  <SelectItem value="cutting-pro">カッティングプロ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSearch}
              className="mt-4 bg-black text-white hover:bg-gray-700 px-4 py-2 rounded"
            >
              <Search className="mr-2 h-4 w-4" /> 検索
            </Button>
          </CardContent>
        </Card>

        {/* テーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">在庫一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {inventoryItems.length === 0 ? (
                <p className="text-center text-gray-500 py-6">在庫データが存在しません。</p>
              ) : (
                <Table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
                  <TableHeader>
                    <TableRow>
                      <SortableTableHead
                        sortKey="shelfNumber"
                        currentSortKey={sortConfig.key}
                        direction={sortConfig.direction}
                        onSort={handleSort}
                      >
                        棚番
                      </SortableTableHead>
                      <SortableTableHead
                        sortKey="attribute"
                        currentSortKey={sortConfig.key}
                        direction={sortConfig.direction}
                        onSort={handleSort}
                      >
                        属性
                      </SortableTableHead>
                      <SortableTableHead
                        sortKey="name"
                        currentSortKey={sortConfig.key}
                        direction={sortConfig.direction}
                        onSort={handleSort}
                      >
                        アイテム名
                      </SortableTableHead>
                      <SortableTableHead
                        sortKey="manufacturer"
                        currentSortKey={sortConfig.key}
                        direction={sortConfig.direction}
                        onSort={handleSort}
                      >
                        メーカー名
                      </SortableTableHead>
                      <SortableTableHead
                        sortKey="current_quantity"
                        currentSortKey={sortConfig.key}
                        direction={sortConfig.direction}
                        onSort={handleSort}
                      >
                        在庫数
                      </SortableTableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.shelfNumber}</TableCell>
                        <TableCell>{item.attribute}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.manufacturer}</TableCell>
                        <TableCell>{item.current_quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ページネーション */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
    </div>
  );
}
