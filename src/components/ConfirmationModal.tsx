// components/ConfirmationModal.tsx

'use client';
import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  usageQuantity: number;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  usageQuantity,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">確認</h2>
        <p>以下のアイテムを更新しますか？</p>
        <div className="my-4">
          <p><strong>アイテム名:</strong> {itemName}</p>
          <p><strong>使用量:</strong> {usageQuantity}</p>
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} className="bg-gray-300 text-gray-800">キャンセル</Button>
          <Button onClick={onConfirm} className="bg-red-500 text-white">更新</Button>
        </div>
      </div>
    </div>
  );
};