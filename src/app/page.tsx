'use client';
import './globals.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from 'react';
import axios from "axios";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

type InventoryItem = {
  id: number;
  shelf_number: string;
  category: { name: string };
  manufacturer: { name: string };
  name: string;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  status: "在庫十分" | "発注必要" | "在庫不足" | "未設定";
};

type ApiResponse = {
  items: InventoryItem[];
  total_items: number;
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [shelfNumber, setShelfNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedManufacturer, setSelectedManufacturer] = useState("すべて");
  const [categories, setCategories] = useState<string[]>(["すべて"]);
  const [manufacturers, setManufacturers] = useState<string[]>(["すべて"]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [sortField, setSortField] = useState<string>(""); // ソート対象のカラム名
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // 昇順か降順か

  // アイテム一覧取得
  const fetchItems = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("http://localhost:3001/api/inventory/items", {
        params: {
          page,
          per_page: itemsPerPage,
          searchTerm: searchTerm || undefined,
          shelfNumber: shelfNumber || undefined,
          category: selectedCategory !== "すべて" ? selectedCategory : undefined,
          manufacturer: selectedManufacturer !== "すべて" ? selectedManufacturer : undefined,
          sortField: sortField || undefined,
          sortOrder: sortOrder || undefined,
        },
      });

      setInventoryItems(response.data.items);
      setTotalItems(response.data.total_items);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // カテゴリー・メーカー取得
  const fetchDropdownData = async () => {
    try {
      const categoryResponse = await axios.get<{ id: number; name: string }[]>("http://localhost:3001/api/categories");
      const manufacturerResponse = await axios.get<{ id: number; name: string }[]>("http://localhost:3001/api/manufacturers");

      // データを変換してドロップダウンにセット
      setCategories(["すべて", ...categoryResponse.data.map((cat) => cat.name)]);
      setManufacturers(["すべて", ...manufacturerResponse.data.map((manu) => manu.name)]);
    } catch (error) {
      console.error("カテゴリーまたはメーカーの取得に失敗しました:", error);
    }
  };

  // 初期データ取得
  useEffect(() => {
    // カテゴリー・メーカーを取得
    fetchDropdownData();

    // アイテム一覧を取得（デフォルト設定）
    fetchItems(currentPage);
  }, []); // 初期ロード時のみ実行

  // ソートや検索条件が変更された場合のデータ再取得
  useEffect(() => {
    fetchItems(1); // 初期ページに戻して再取得
  }, [sortField, sortOrder, selectedCategory, selectedManufacturer]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchItems(page); // ページ変更時に再取得
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchItems(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="棚番"
                value={shelfNumber}
                onChange={(e) => setShelfNumber(e.target.value)}
                className="w-full bg-white"
              />
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="アイテム名"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white"
              />
              <Select onValueChange={(value) => setSelectedManufacturer(value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="メーカーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((manufacturer, index) => (
                    <SelectItem key={index} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <Button
                onClick={handleSearch}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Search className="mr-2 h-4 w-4" /> 検索
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>在庫・発注リスト</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">データを読み込んでいます...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("shelfNumber")}>棚番</TableHead>
                    <TableHead onClick={() => handleSort("category")}>カテゴリー</TableHead>
                    <TableHead onClick={() => handleSort("name")}>アイテム名</TableHead>
                    <TableHead onClick={() => handleSort("manufacturer")}>メーカー</TableHead>
                    <TableHead>現在の在庫数</TableHead>
                    <TableHead>発注基準数</TableHead>
                    <TableHead>適正在庫数</TableHead>
                    <TableHead onClick={() => handleSort("status")}>状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.shelf_number || "未設定"}</TableCell>
                      <TableCell>{item.category.name || "未分類"}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.manufacturer.name || "不明"}</TableCell>
                      <TableCell>{item.current_quantity}</TableCell>
                      <TableCell>{item.reorder_threshold}</TableCell>
                      <TableCell>{item.optimal_quantity}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

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
