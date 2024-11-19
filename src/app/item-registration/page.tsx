"use client";
import '../globals.css';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, { message: "アイテム名は必須です。" }),
  description: z.string().min(1, { message: "説明は必須です。" }),
  category_id: z.string().nonempty({ message: "カテゴリIDは必須です。" }),
  manufacturer_id: z.string().nonempty({ message: "メーカーIDは必須です。" }),
  shelfNumber: z.string().min(1, { message: "棚番は必須です。" }),
  currentQuantity: z.number().min(0, { message: "数量は0以上である必要があります。" }),
  optimalQuantity: z.number().min(1, { message: "適正在庫数は1以上である必要があります。" }),
  reorderThreshold: z.number().min(0, { message: "発注基準数は0以上である必要があります。" }),
  unit: z.string().min(1, { message: "単位は必須です。" }),
  supplierInfo: z.string().min(1, { message: "仕入先情報は必須です。" }),
  price: z.number().min(0, { message: "価格は0以上である必要があります。" }),
});

export default function ItemRegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
      manufacturer_id: "",
      shelfNumber: "",
      currentQuantity: 0,
      optimalQuantity: 1,
      reorderThreshold: 0,
      unit: "",
      supplierInfo: "",
      price: 0,
    },
  });

  // カテゴリー関連の状態管理
  type Category = { id: string; name: string };
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // メーカー関連の状態管理
  type Manufacturer = { id: string; name: string };
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [newManufacturer, setNewManufacturer] = useState("");
  const [showNewManufacturerInput, setShowNewManufacturerInput] = useState(false);

  // カテゴリーとメーカーのデータ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch("http://localhost:3001/api/categories");
        const manufacturerResponse = await fetch("http://localhost:3001/api/manufacturers");
        const categoryData = await categoryResponse.json();
        const manufacturerData = await manufacturerResponse.json();

        setCategories(categoryData);
        setManufacturers(manufacturerData);
      } catch (error) {
        console.error("データの取得に失敗しました。", error);
      }
    };

    fetchData();
  }, []);

  const handleNewCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "エラー",
        description: "カテゴリ名を入力してください。",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) throw new Error("カテゴリの登録に失敗しました。");

      const createdCategory = await response.json();
      setCategories((prev) => [
        ...prev,
        { ...createdCategory, id: createdCategory.id.toString() }, // 数値を文字列に変換
      ]);
      setNewCategory("");
      setShowNewCategoryInput(false);

      toast({
        title: "成功",
        description: "新しいカテゴリが登録されました。",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "カテゴリの登録に失敗しました。",
        variant: "destructive",
      });
    }
  };

  const handleNewManufacturer = async () => {
    if (!newManufacturer.trim()) {
      toast({
        title: "エラー",
        description: "メーカー名を入力してください。",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/manufacturers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newManufacturer }),
      });

      if (!response.ok) throw new Error("メーカーの登録に失敗しました。");

      const createdManufacturer = await response.json();
      setManufacturers((prev) => [
        ...prev,
        { ...createdManufacturer, id: createdManufacturer.id.toString() }, // 数値を文字列に変換
      ]);
      setNewManufacturer("");
      setShowNewManufacturerInput(false);

      toast({
        title: "成功",
        description: "新しいメーカーが登録されました。",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "エラー",
        description: "メーカーの登録に失敗しました。",
        variant: "destructive",
      });
    }
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      name: values.name,
      description: values.description,
      category_id: values.category_id,
      shelf_number: values.shelfNumber,
      current_quantity: values.currentQuantity,
      optimal_quantity: values.optimalQuantity,
      reorder_threshold: values.reorderThreshold,
      unit: values.unit,
      manufacturer: values.manufacturer_id,
      supplier_info: values.supplierInfo,
      price: values.price,
    };

    try {
      const response = await fetch("http://127.0.0.1:3001/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: payload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("APIエラー:", errorData);
        throw new Error("登録に失敗しました");
      }

      toast({ title: "成功", description: "アイテムが登録されました。" });

      // 登録完了後、在庫・発注ページに遷移
      router.push("/inventory-management");
    } catch (error: any) {
      console.error("エラー:", error.message || error);
      toast({
        title: "エラー",
        description: error.message || "登録中に問題が発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>アイテム登録</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(form.formState.errors).length > 0 &&
            (() => {
              console.log("フォームのエラー:", form.formState.errors); // 外部でログ出力
              return null; // JSX に何も描画しない
            })()}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // デフォルトのフォーム送信を防止
              console.log("フォーム送信がトリガーされました");
              form.handleSubmit(onSubmit)(e); // 明示的にhandleSubmitを呼び出す
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>アイテム名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="アイテム名を入力" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea placeholder="アイテムの説明を入力" {...field} />
                  </FormControl>
                  <FormDescription>
                    アイテムの詳細な説明や特徴を記入してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Select
              onValueChange={(value) => {
                const selectedCategory = categories.find((cat) => cat.name === value);
                form.setValue("category_id", selectedCategory?.id.toString() || ""); // 数値を文字列に変換
                if (value === "新しいカテゴリ") setShowNewCategoryInput(true);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value="新しいカテゴリ">新しいカテゴリを登録</SelectItem>
              </SelectContent>
            </Select>
            {showNewCategoryInput && (
              <div>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="新しいカテゴリ名を入力"
                />
                <Button onClick={handleNewCategory}>カテゴリを登録</Button>
              </div>
            )}
            <FormField
              control={form.control}
              name="shelfNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>棚番</FormLabel>
                  <FormControl>
                    <Input placeholder="棚番を入力" {...field} />
                  </FormControl>
                  <FormDescription>アイテムが保管されている棚の番号です。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="currentQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>現在の数量</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimalQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>適正在庫数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reorderThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>発注基準数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>単位</FormLabel>
                  <FormControl>
                    <Input placeholder="単位を入力（例：個、本、kg）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* メーカー選択 */}
            <Select
              onValueChange={(value) => {
                const selectedManufacturer = manufacturers.find((manu) => manu.name === value);
                form.setValue("manufacturer_id", selectedManufacturer?.id.toString() || ""); // 数値を文字列に変換
                if (value === "新しいメーカー") setShowNewManufacturerInput(true);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="メーカーを選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer.id} value={manufacturer.name}>
                    {manufacturer.name}
                  </SelectItem>
                ))}
                <SelectItem value="新しいメーカー">新しいメーカーを登録</SelectItem>
              </SelectContent>
            </Select>
            {showNewManufacturerInput && (
              <div>
                <Input
                  value={newManufacturer}
                  onChange={(e) => setNewManufacturer(e.target.value)}
                  placeholder="新しいメーカー名を入力"
                />
                <Button onClick={handleNewManufacturer}>メーカーを登録</Button>
              </div>
            )}
            <FormField
              control={form.control}
              name="supplierInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>仕入先情報</FormLabel>
                  <FormControl>
                    <Textarea placeholder="仕入先の情報を入力" {...field} />
                  </FormControl>
                  <FormDescription>
                    仕入先の名称、連絡先などを記入してください。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>価格</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登録中..." : "アイテムを登録"}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/inventory-management")}
              className="w-full mt-2"
              variant="outline"
            >
              登録せずに戻る
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
