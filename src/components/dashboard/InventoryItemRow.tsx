// src/components/Dashboard/InventoryItemRow.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

type InventoryItemRowProps = {
  item: InventoryItem;
  onViewDetails: (id: number) => void;
  onQuickOrder: (id: number) => void;
  onQuickEdit: (id: number) => void;
};

export default function InventoryItemRow({
  item,
  onViewDetails,
  onQuickOrder,
  onQuickEdit,
}: InventoryItemRowProps) {
  return (
    <TableRow key={item.id}>
      <TableCell>
        <Badge variant={item.orderStatus === "発注中" ? "secondary" : "destructive"}>
          {item.orderStatus}
        </Badge>
      </TableCell>
      <TableCell>{item.shelfNumber}</TableCell>
      <TableCell>{item.attribute}</TableCell>
      <TableCell>{item.itemName}</TableCell>
      <TableCell>{item.manufacturer}</TableCell>
      <TableCell className="text-right">{item.optimalQuantity} {item.unit}</TableCell>
      <TableCell className="text-right">{item.reorderThreshold} {item.unit}</TableCell>
      <TableCell className="text-right">
        <span className={item.currentQuantity <= item.reorderThreshold ? "text-red-600 font-medium" : ""}>
          {item.currentQuantity} {item.unit}
        </span>
        {item.currentQuantity <= item.reorderThreshold && (
          <AlertTriangle className="inline ml-2 h-4 w-4 text-red-600" />
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(item.id)}>
            詳細
          </Button>
          {item.currentQuantity <= item.reorderThreshold && (
            <Button variant="outline" size="sm" onClick={() => onQuickOrder(item.id)}>
              発注
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onQuickEdit(item.id)}>
            編集
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
