'use client';
import '../globals.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from 'react';
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

type InventoryItem = {
  id: number;
  itemName: string;
  manufacturer: string;
  currentQuantity: number;
  reorderThreshold: number;
  optimalQuantity: number;
  orderQuantity: number;
  unit: string;
  status: '未発注' | '発注中' | '発注済み' | '在庫十分';
};

export default function InventoryOrderPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryItems] = useState<InventoryItem[]>([
    // ダミーデータ
    { id: 1, itemName: "切削油", manufacturer: "テックオイル", currentQuantity: 15, reorderThreshold: 20, optimalQuantity: 100, orderQuantity: 50, unit: "L", status: '未発注' },
    { id: 2, itemName: "超硬ドリル", manufacturer: "ツールテック", currentQuantity: 8, reorderThreshold: 10, optimalQuantity: 50, orderQuantity: 20, unit: "本", status: '発注中' },
    { id: 3, itemName: "エンドミル", manufacturer: "カッティングプロ", currentQuantity: 25, reorderThreshold: 15, optimalQuantity: 40, orderQuantity: 0, unit: "個", status: '在庫十分' },
  ]);

  const filteredItems = inventoryItems.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOrder = (itemId: number) => {
    // 発注処理の実装
    console.log(`アイテムID ${itemId} の発注処理を開始`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
            <Header />
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input placeholder="棚番" className="w-full bg-white" />
            <Select>
              <SelectTrigger className="bg-white">
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
              className="w-full bg-white"
            />
            <Select>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="メーカー名" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech-oil">テックオイル</SelectItem>
                <SelectItem value="tool-tech">ツールテック</SelectItem>
                <SelectItem value="cutting-pro">カッティングプロ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Search className="mr-2 h-4 w-4" /> 検索
            </Button>
            <div className="flex space-x-2">
              <Button 
                onClick={() => router.push('/item-registration')}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                新規アイテム登録
              </Button>
              <Button 
                onClick={() => router.push('/inventory-history')}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>アイテム名</TableHead>
                <TableHead>メーカー</TableHead>
                <TableHead>現在の在庫数</TableHead>
                <TableHead>発注基準数</TableHead>
                <TableHead>適正在庫数</TableHead>
                <TableHead>発注数量</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>
                    <span className={item.currentQuantity <= item.reorderThreshold ? "text-red-600 font-medium" : ""}>
                      {item.currentQuantity} {item.unit}
                    </span>
                    {item.currentQuantity <= item.reorderThreshold && (
                      <AlertTriangle className="inline ml-2 h-4 w-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>{item.reorderThreshold} {item.unit}</TableCell>
                  <TableCell>{item.optimalQuantity} {item.unit}</TableCell>
                  <TableCell>{item.orderQuantity > 0 ? `${item.orderQuantity} ${item.unit}` : '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === '未発注' ? "destructive" : 
                        item.status === '発注中' ? "secondary" : 
                        item.status === '発注済み' ? "default" :
                        "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/items/${item.id}/edit`)}>
                        編集
                      </Button>
                      {item.currentQuantity <= item.reorderThreshold && item.status !== '発注中' && item.status !== '発注済み' && (
                        <Button variant="outline" size="sm" onClick={() => handleOrder(item.id)}>
                          発注
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Footer />

    </div>
  );
}
