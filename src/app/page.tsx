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
import ProtectedPage from "@/pages/protected";
import { useRouter } from "next/router";
import api from "@/lib/api";

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
  const [sortField, setSortField] = useState<string>("shelfNumber"); // デフォルトのソートフィールド
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // デフォルトのソート順
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get("/auth/me"); // 認証確認のエンドポイント
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("jwtToken"); // 不正なトークンの場合削除
        alert("ログインが必要です");
        router.push("/login"); // ログインページにリダイレクト
      }
    };

    verifyAuth();
  }, [router]);

  if (!isAuthenticated) {
    return <p>認証確認中...</p>;
  }

  // 在庫状態を計算する関数
  const calculateStatus = (
    current_quantity: number | null,
    optimal_quantity: number | null,
    reorder_threshold: number | null
  ): string => {
    if (current_quantity === null || optimal_quantity === null || reorder_threshold === null) {
      return "未設定";
    }
    if (current_quantity <= reorder_threshold) {
      return "発注必要";
    } else if (current_quantity < optimal_quantity) {
      return "在庫不足";
    }
    return "在庫十分";
  };

  // フェッチしたアイテムの処理を追加
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

      const processedItems = response.data.items.map((item) => ({
        ...item,
        status: item.status || calculateStatus(item.current_quantity, item.optimal_quantity, item.reorder_threshold),
      }));

      setInventoryItems(processedItems);
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
    fetchDropdownData(); // カテゴリー・メーカーを取得
    fetchItems(1); // アイテム一覧を取得（デフォルト設定）
  }, []);

  // ソートや検索条件が変更された場合のデータ再取得
  useEffect(() => {
    fetchItems(currentPage); // 現在のページでデータを再取得
  }, [currentPage, sortField, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchItems(page); // ページ変更時に再取得
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchItems(1);
  };

  const handleSort = (field: string) => {
    // フロントエンドのフィールド名をバックエンドに対応させる
    const backendField = field === "name" ? "itemName" : field;

    if (sortField === backendField) {
      // 同じフィールドでソート方向を切り替える
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 新しいフィールドでソートを設定
      setSortField(backendField);
      setSortOrder("asc"); // 初期値を昇順にする
    }
  };

  return (
    <ProtectedPage>
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
                      <TableCell>{item.status || calculateStatus(item.current_quantity, item.optimal_quantity, item.reorder_threshold)}</TableCell>
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
    </ProtectedPage>
  );
}
