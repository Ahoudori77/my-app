'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

type Category = {
  id: number | string; // 新規カテゴリーの場合は一時的に`string`を使う
  name: string;
};

type CategorySelectProps = {
  value: string | number; // 選択中のカテゴリーID
  onChange: (categoryId: string | number) => void; // 選択変更時のコールバック
};

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // カテゴリーの一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventory/items');
        if (!response.ok) throw new Error('カテゴリーの取得に失敗しました');
        const data: Category[] = await response.json();
        setCategories([...data, { id: 'other', name: 'その他' }]);
      } catch (error) {
        console.error(error);
        toast({ title: 'エラー', description: 'カテゴリー取得中に問題が発生しました', variant: 'destructive' });
      }
    };
    fetchCategories();
  }, []);

  // 新しいカテゴリーを追加
  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      toast({ title: '入力エラー', description: '新しいカテゴリー名を入力してください', variant: 'destructive' });
      return;
    }
    setIsAdding(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      if (!response.ok) throw new Error('カテゴリーの追加に失敗しました');
      const createdCategory: Category = await response.json();
      setCategories(prev => [...prev.filter(cat => cat.id !== 'other'), createdCategory, { id: 'other', name: 'その他' }]);
      onChange(createdCategory.id); // 新しいカテゴリーを選択
      setNewCategory('');
      toast({ title: '成功', description: 'カテゴリーが正常に追加されました' });
    } catch (error) {
      console.error(error);
      toast({ title: 'エラー', description: 'カテゴリーの追加に失敗しました', variant: 'destructive' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <Select onValueChange={onChange} value={String(value)}>
        <SelectTrigger>
          <SelectValue placeholder="カテゴリーを選択" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value === 'other' && (
        <div className="mt-4">
          <Input
            placeholder="新しいカテゴリーを入力"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            disabled={isAdding}
          />
          <Button onClick={handleAddNewCategory} className="mt-2" disabled={isAdding}>
            {isAdding ? '追加中...' : '追加'}
          </Button>
        </div>
      )}
    </div>
  );
}
