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
  shelfNumber: z.string().min(1, { message: "棚番は必須です。" }),
  currentQuantity: z.number().min(0, { message: "数量は0以上である必要があります。" }),
  optimalQuantity: z.number().min(1, { message: "適正在庫数は1以上である必要があります。" }),
  reorderThreshold: z.number().min(0, { message: "発注基準数は0以上である必要があります。" }),
  unit: z.string().min(1, { message: "単位は必須です。" }),
  manufacturer: z.string().min(1, { message: "メーカー名は必須です。" }),
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
      shelfNumber: "",
      currentQuantity: 0,
      optimalQuantity: 1,
      reorderThreshold: 0,
      unit: "",
      manufacturer: "",
      supplierInfo: "",
      price: 0,
    },
  });

  type Category = {
    id: string; // UUID は文字列
    name: string;
  };
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<string>(""); // 新しいカテゴリ名
  const initialCategories: Category[] = []; // 空の配列を初期値として定義
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("カテゴリの取得に失敗しました。", error);
      }
    };
  
    fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    const selected = categories.find((category) => category.name === value);
    console.log("選択されたカテゴリ:", selected);
    console.log("設定されたcategory_id:", selected ? selected.id : null);
    if (selected) {
      setSelectedCategory(selected);
      form.setValue("category_id", String(selected.id)); // UUIDを文字列として設定
    } else {
      setSelectedCategory(null);
      form.setValue("category_id", ""); // 明示的にリセット
    }
  };

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
      const response = await fetch("http://127.0.0.1:3001/api/inventory/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
  
      if (!response.ok) throw new Error("カテゴリの登録に失敗しました。");
  
      const createdCategory: { id: string; name: string } = await response.json();
      setCategories((prev) => [...prev, createdCategory]); // 型の整合性を確保
      setNewCategory(""); // 入力フィールドをリセット
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
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // SSR時には何も描画しない
  }

  const handleBack = () => {
    router.push("/inventory-management");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("送信データ:", values);

    setIsLoading(true);
    const payload = {
      name: values.name,
      description: values.description,
      category_id: values.category_id,
      shelf_number: values.shelfNumber, // キャメルケースをスネークケースに修正
      current_quantity: values.currentQuantity,
      optimal_quantity: values.optimalQuantity,
      reorder_threshold: values.reorderThreshold,
      unit: values.unit,
      manufacturer: values.manufacturer,
      supplier_info: values.supplierInfo, // キャメルケースをスネークケースに修正
      price: values.price,
    };

    console.log("送信データ:", values); // 確認用ログ
    setIsLoading(true);
  
    const isDuplicate = await checkShelfNumber(values.shelfNumber);
    if (isDuplicate) {
      toast({
        title: "エラー",
        description: "入力した棚番号は既に使用されています。別の棚番号を入力してください。",
        variant: "destructive",
      });
      return; // 重複の場合は処理を中断
    }
  
    setIsLoading(true);
  
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

  async function checkShelfNumber(shelfNumber: string): Promise<boolean> {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/inventory/items/check_shelf_number?shelf_number=${shelfNumber}`);
      if (!response.ok) throw new Error("APIリクエストが失敗しました");
  
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("棚番号の確認中にエラーが発生しました:", error);
      return false;
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
  value={selectedCategory ? selectedCategory.name : ""}
  onValueChange={(value) => {
    const selected = categories.find((category) => category.name === value);
    if (selected) {
      setSelectedCategory(selected);
      form.setValue("category_id", String(selected.id)); // category_id をフォームデータに設定
    } else if (value === "新しいカテゴリ") {
      setShowNewCategoryInput(true);
    }
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
    <SelectItem key="new" value="新しいカテゴリ">
      新しいカテゴリを登録
    </SelectItem>
  </SelectContent>
</Select>
{showNewCategoryInput && (
  <div className="mt-2 space-y-2">
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
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メーカー名</FormLabel>
                  <FormControl>
                    <Input placeholder="メーカー名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              onClick={handleBack}
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