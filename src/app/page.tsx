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

type InventoryItem = {
  id: number;
  orderStatus: string;
  shelfNumber: string;
  attribute: string;
  itemName: string;
  manufacturer: string;
  optimalQuantity: number;
  reorderThreshold: number;
  currentQuantity: number;
  unit: string;
};

export default function Dashboard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<InventoryItem[]>('http://localhost:3001/api/inventory/items');
        setInventoryItems(response.data);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
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

  const filteredItems = inventoryItems
    .filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const order = sortConfig.direction === "asc" ? 1 : -1;
      if (a[sortConfig.key as keyof InventoryItem] < b[sortConfig.key as keyof InventoryItem]) return -order;
      if (a[sortConfig.key as keyof InventoryItem] > b[sortConfig.key as keyof InventoryItem]) return order;
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
      <p>データがありません</p>
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
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Badge variant={item.orderStatus === "発注中" ? "secondary" : "destructive"}>
                          {item.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.shelfNumber}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.attribute}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.itemName}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.manufacturer}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" >{item.optimalQuantity} {item.unit}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" >{item.reorderThreshold} {item.unit}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                        <span className={item.currentQuantity <= item.reorderThreshold ? "text-red-600 font-medium" : ""}>
                          {item.currentQuantity} {item.unit}
                        </span>
                        {item.currentQuantity <= item.reorderThreshold && (
                          <AlertTriangle className="inline ml-2 h-4 w-4 text-red-600" />
                        )}
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
