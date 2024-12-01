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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';
import ConfirmationModal from "@/components/ConfirmationModal";
import ProtectedPage from "@/pages/protected";


type InventoryItem = {
  id: number;
  shelf_number: string;
  category: { name: string };
  manufacturer: { name: string };
  name: string;
  current_quantity: number;
  optimal_quantity: number;
  reorder_threshold: number;
  usage_quantity: number; // 使用量
};

type ApiResponse = {
  items: InventoryItem[];
  total_items: number;
};

export default function UsageInputPage() {
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
  const [sortField, setSortField] = useState<string>("shelfNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedItem) return;

    try {
      await axios.patch(
        `http://localhost:3001/api/inventory/items/${selectedItem.id}/update_usage`,
        { usage_quantity: selectedItem.usage_quantity }
      );
      alert("更新が完了しました！");
      setIsModalOpen(false);
      fetchItems(currentPage); // データ再取得
    } catch (error) {
      console.error("使用量の更新に失敗しました:", error);
    }
  };

  // アイテム取得
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
          sortField,
          sortOrder,
        },
      });

      const processedItems = response.data.items.map((item) => ({
        ...item,
        usage_quantity: 0, // 初期値を0に設定
      }));

      setInventoryItems(processedItems);
      setTotalItems(response.data.total_items);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 使用量を更新する関数
  const updateUsageQuantity = (id: number, delta: number) => {
    setInventoryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, usage_quantity: Math.max(0, item.usage_quantity + delta) }
          : item
      )
    );
  };

  // 使用量をサーバーに送信する関数
  const submitUsageData = async (id: number) => {
    const item = inventoryItems.find((item) => item.id === id);

    if (!item) return;

    try {
      await axios.patch(`http://localhost:3001/api/inventory/items/${id}/update_usage`, {
        usage_quantity: item.usage_quantity,
      });

      // データ更新後リロード
      fetchItems(currentPage);
    } catch (error) {
      console.error("使用量の更新に失敗しました:", error);
    }
  };

  // 初期データ取得
  useEffect(() => {
    fetchDropdownData();
    fetchItems(1);
  }, []);  // カテゴリー・メーカー取得
  const fetchDropdownData = async () => {
    try {
      const categoryResponse = await axios.get<{ id: number; name: string }[]>("http://localhost:3001/api/categories");
      const manufacturerResponse = await axios.get<{ id: number; name: string }[]>("http://localhost:3001/api/manufacturers");

      setCategories(["すべて", ...categoryResponse.data.map((cat) => cat.name)]);
      setManufacturers(["すべて", ...manufacturerResponse.data.map((manu) => manu.name)]);
    } catch (error) {
      console.error("カテゴリーまたはメーカーの取得に失敗しました:", error);
    }
  };

  // 初期データ取得
  useEffect(() => {
    fetchDropdownData();
    fetchItems(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchItems(1);
  };

  return (
    <ProtectedPage>
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="p-4 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">アイテム検索</h2>
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
          <Button onClick={handleSearch} className="bg-black hover:bg-gray-800 text-white">
            <Search className="mr-2 h-4 w-4" /> 検索
          </Button>
        </div>

        <div className="p-4 bg-white shadow-md rounded-md mt-6">
          <h2 className="text-xl font-semibold mb-4">使用量入力</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500">データを読み込んでいます...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>棚番</TableHead>
                  <TableHead>カテゴリー</TableHead>
                  <TableHead>アイテム名</TableHead>
                  <TableHead>現在の在庫数</TableHead>
                  <TableHead>使用量</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.shelf_number || "未設定"}</TableCell>
                    <TableCell>{item.category?.name || "未分類"}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.current_quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => updateUsageQuantity(item.id, -1)}>
                          -1
                        </Button>
                        <Input
                          type="number"
                          value={item.usage_quantity}
                          onChange={(e) =>
                            updateUsageQuantity(item.id, Number(e.target.value) - item.usage_quantity)
                          }
                          className="w-16 text-center"
                        />
                        <Button variant="ghost" onClick={() => updateUsageQuantity(item.id, 1)}>
                          +1
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleOpenModal(item)}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        更新
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
      {isModalOpen && selectedItem && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmUpdate}
          itemName={selectedItem.name}
          usageQuantity={selectedItem.usage_quantity}
        />
      )}
    </div>
    </ProtectedPage>
  );
}
