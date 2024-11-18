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
import axios from 'axios';
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
import { Badge } from "@/components/ui/badge";

type UserRole = 'field' | 'office';
const userRole: UserRole = 'office';

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

type ApiResponse = InventoryItem[];

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

export default function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(inventoryItems.length / 10); // 1ページあたり10件表示の場合


  useEffect(() => {
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
    
    const fetchData = async () => {
      try {
        const response = await axios.get<{ items: InventoryItem[] }>('http://localhost:3001/api/inventory/items');
        console.log('API Response:', response.data);
    
        const items = response.data.items.map((item) => ({
          id: item.id,
          name: item.name,
          manufacturer: item.manufacturer || '不明',
          current_quantity: item.current_quantity || 0,
          reorder_threshold: item.reorder_threshold || 0,
          optimal_quantity: item.optimal_quantity || 0,
          unit: item.unit || '',
          shelfNumber: item.shelfNumber || 'N/A',
          attribute: item.attribute || 'N/A',
        }));
        setInventoryItems(items);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };
  
    fetchData();
  }, []);

  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredItems = inventoryItems.filter((item) =>
    [item.name, item.shelfNumber].some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
    )
    .sort((a, b) => {
      const order = sortConfig.direction === "asc" ? 1 : -1;
      const valueA = a[sortConfig.key as keyof InventoryItem];
      const valueB = b[sortConfig.key as keyof InventoryItem];
    
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * order;
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * order;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
        <Card className="mb-8 p-4 shadow-sm border rounded-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="棚番" className="w-full" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="属性" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil">油脂類</SelectItem>
                  <SelectItem value="drill">ドリル類</SelectItem>
                  <SelectItem value="cutting">切削工具</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="アイテム名" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="メーカー名" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech-oil">テックオイル</SelectItem>
                  <SelectItem value="tool-tech">ツールテック</SelectItem>
                  <SelectItem value="cutting-pro">カッティングプロ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="mt-4 bg-black text-white hover:bg-gray-700 px-4 py-2 rounded">
              <Search className="mr-2 h-4 w-4" /> 検索
            </Button>
          </CardContent>
        </Card>
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
                    <SortableTableHead sortKey="orderStatus" currentSortKey={sortConfig.key} direction={sortConfig.direction} onSort={handleSort}>
                      発注状況
                    </SortableTableHead>
                    <SortableTableHead sortKey="shelfNumber" currentSortKey={sortConfig.key} direction={sortConfig.direction} onSort={handleSort}>
                      棚番
                    </SortableTableHead>
                    <SortableTableHead sortKey="attribute" currentSortKey={sortConfig.key} direction={sortConfig.direction} onSort={handleSort}>
                      属性
                    </SortableTableHead>
                    <SortableTableHead sortKey="itemName" currentSortKey={sortConfig.key} direction={sortConfig.direction} onSort={handleSort}>
                      アイテム名
                    </SortableTableHead>
                    <SortableTableHead sortKey="manufacturer" currentSortKey={sortConfig.key} direction={sortConfig.direction} onSort={handleSort}>
                      メーカー名
                    </SortableTableHead>
                    <TableHead className="text-right">適正在庫数</TableHead>
                    <TableHead className="text-right">発注基準数</TableHead>
                    <SortableTableHead sortKey="currentQuantity" currentSortKey={sortConfig.key} direction={sortConfig.direction} onSort={handleSort}>
                      在庫数
                    </SortableTableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={item.current_quantity <= item.reorder_threshold ? "text-red-600 font-medium" : ""}>
                           {item.current_quantity} {item.unit}
                          </span>
                      {item.current_quantity <= item.reorder_threshold && (
                        <AlertTriangle className="inline ml-2 h-4 w-4 text-red-600" />
                          )}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.shelfNumber}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.attribute}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.manufacturer}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.optimal_quantity} {item.unit}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reorder_threshold} {item.unit}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className={item.current_quantity <= item.reorder_threshold ? "text-red-600 font-medium" : ""}>
          {item.current_quantity} {item.unit}
        </span>
      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                  )}
            </div>
          </CardContent>
        </Card>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </main>
      <Footer />
    </div>
  );
}
