// lib/types.ts
export type InventoryItem = {
  id: number;
  orderStatus: string;
  shelfNumber: string;
  attribute: string;
  itemName: string;
  manufacturer: string;
  optimalQuantity: number;
  reorderThreshold: number;
  currentQuantity: number;
  unit: string;
};
