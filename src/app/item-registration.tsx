'use client';
import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, { message: "アイテム名は必須です。" }),
  description: z.string().min(1, { message: "説明は必須です。" }),
  category: z.string({ required_error: "カテゴリーを選択または入力してください。" }),
  shelfNumber: z.string().min(1, { message: "棚番は必須です。" }),
  currentQuantity: z.number().min(0, { message: "現在の数量は0以上である必要があります。" }),
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
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: undefined,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, typeof value === 'number' ? String(value) : value as string | Blob);
  });
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アイテムの登録に失敗しました');
      }

      toast({
        title: "登録成功",
        description: "アイテムが正常に登録されました。",
      });
      router.push('/items');
    } catch (error) {
      console.error('Item registration error:', error);
      toast({
        title: "エラー",
        description: "アイテムの登録中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>アイテム登録</CardTitle>
          <CardDescription>新しいアイテムを在庫管理システムに登録します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 他のフィールドと同様に各入力フィールドを実装 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>アイテム名</FormLabel>
                    <FormControl>
                      <Input placeholder="アイテム名を入力" {...field} />
                    </FormControl>
                    <FormDescription>
                      システムで使用するアイテムの名称です。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 画像アップロード機能 */}
              <FormItem>
                <FormLabel>画像アップロード</FormLabel>
                <FormControl>
                  <Input type="file" onChange={handleImageChange} />
                </FormControl>
                <FormDescription>アイテムの画像を選択してください。</FormDescription>
              </FormItem>

              {/* カテゴリー選択 */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリー</FormLabel>
                    <Select defaultValue={String(field.value)} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリーを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oil">油脂類</SelectItem>
                        <SelectItem value="drill">ドリル類</SelectItem>
                        <SelectItem value="cutting">切削工具</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 他の入力フィールドは省略 */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登録中..." : "アイテムを登録"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
