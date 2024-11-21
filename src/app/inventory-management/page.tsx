'use client';
import '../globals.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import axios from "axios";
import Pagination from "@/components/ui/pagination";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, Plus, History } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApiResponse = {
  items: any[]; // APIの生データ
  total_items: number;
};

type InventoryItem = {
  id: number;
  orderStatus: string; // 発注状況
  shelfNumber: string; // 棚番
  attribute: string;   // 属性
  itemName: string;    // アイテム名
  manufacturer: string; // メーカー名
  optimalQuantity: number; // 適正在庫数
  reorderThreshold: number; // 発注基準数
  currentQuantity: number;  // 現在の在庫数
  unit: string;  // 単位
  orderQuantity: number; // 発注数量
  category: string; // カテゴリー
  status: "未発注" | "発注中" | "発注済み" | "在庫十分"; // ステータス
};

export default function InventoryOrderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const fetchItems = async (page: number) => {
    setIsLoading(true); // ローディング開始
    try {
      const response = await axios.get<ApiResponse>("http://localhost:3001/api/inventory/items", {
        params: {
          page,
          per_page: itemsPerPage,
          searchTerm: searchTerm || undefined, // 入力された検索キーワード
          shelfNumber: shelfNumber || undefined, // 棚番
          category: selectedCategory !== "すべて" ? selectedCategory : undefined, // 「すべて」の場合は条件を適用しない
          manufacturer: selectedManufacturer !== "すべて" ? selectedManufacturer : undefined, // 同様
          sortField: sortField || undefined, // ソート対象のカラム
          sortOrder: sortOrder || undefined, // ソート順
        },
      });

      const processItems = (data: any[]): InventoryItem[] => {
        return data.map((item) => ({
          id: item.id,
          itemName: item.name,
          manufacturer: item.manufacturer?.name || "不明",
          currentQuantity: item.current_quantity || 0,
          reorderThreshold: item.reorder_threshold || 0,
          optimalQuantity: item.optimal_quantity || 0,
          orderQuantity: 0, // 初期値
          unit: item.unit || '',
          shelfNumber: item.shelf_number || '', // デフォルト値
          category: item.category?.name || '未分類',
          attribute: item.attribute || '',     // デフォルト値
          orderStatus: '未発注', // 初期値を設定
          status: item.current_quantity <= item.reorder_threshold
            ? '未発注'
            : item.current_quantity < item.optimal_quantity
              ? '発注中'
              : '在庫十分',
        }));
      };
      setInventoryItems(processItems(response.data.items));
      setTotalItems(response.data.total_items);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredItems = inventoryItems.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (itemId: number) => {
    router.push(`/inventory-management/edit/${itemId}`);
  };

  const handleOrder = (itemId: number) => {
    router.push(`/inventory-management/order/${itemId}`);
  };
  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedManufacturer, setSelectedManufacturer] = useState("すべて");
  const [shelfNumber, setShelfNumber] = useState("");
  const [categories, setCategories] = useState<string[]>([]); // カテゴリーリスト
  const [manufacturers, setManufacturers] = useState<string[]>([]); // メーカーリスト
  const [sortField, setSortField] = useState<string>(""); // ソート対象のカラム名
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // 昇順か降順か
  const handleSort = (field: string) => {
    if (sortField === field) {
      // 同じフィールドをクリックした場合はソート順を反転
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 新しいフィールドの場合は昇順でソート
      setSortField(field);
      setSortOrder("asc");
    }
    fetchItems(1); // ソート条件が変更されたので最初のページを再取得
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const categoryResponse = await axios.get<Array<{ id: number; name: string }>>(
          "http://localhost:3001/api/categories"
        );
        const manufacturerResponse = await axios.get<Array<{ id: number; name: string }>>(
          "http://localhost:3001/api/manufacturers"
        );

        setCategories(["すべて", ...categoryResponse.data.map((cat) => cat.name)]);
        setManufacturers(["すべて", ...manufacturerResponse.data.map((manu) => manu.name)]);
      } catch (error) {
        console.error("カテゴリーまたはメーカーの取得に失敗しました:", error);
      }
    };

    fetchDropdownData();
  }, []);

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
                onChange={(e) => setShelfNumber(e.target.value)} // 棚番の状態を更新
                className="w-full bg-white"
              />
              <Select
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
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
              <Select
                onValueChange={(value) => setSelectedManufacturer(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="メーカーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <Button
                onClick={() => fetchItems(1)} // 最初のページから検索
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Search className="mr-2 h-4 w-4" /> 検索
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={() => router.push('/item-registration')}
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新規アイテム登録
                </Button>
                <Button
                  onClick={() => router.push('/inventory-history')}
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <History className="mr-2 h-4 w-4" />
                  履歴管理
                </Button>
              </div>
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
                    <TableHead onClick={() => handleSort("itemName")}>アイテム名</TableHead>
                    <TableHead onClick={() => handleSort("manufacturer")}>メーカー</TableHead>
                    <TableHead>現在の在庫数</TableHead>
                    <TableHead>発注基準数</TableHead>
                    <TableHead>適正在庫数</TableHead>
                    <TableHead>発注数量</TableHead>
                    <TableHead onClick={() => handleSort("status")}>状態</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.shelfNumber || "未設定"}</TableCell>
                      <TableCell>{item.category || "未分類"}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.manufacturer || "不明"}</TableCell>
                      <TableCell>{item.currentQuantity}</TableCell>
                      <TableCell>{item.reorderThreshold}</TableCell>
                      <TableCell>{item.optimalQuantity}</TableCell>
                      <TableCell>{item.orderQuantity}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item.id)}
                          >
                            <Link href={`/inventory-management/edit/${item.id}`}>編集</Link>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOrder(item.id)}
                          >
                            発注
                          </Button>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)} // 総ページ数を計算
          onPageChange={handlePageChange}
        />
      </main>
      <Footer />
    </div>

  );
}
