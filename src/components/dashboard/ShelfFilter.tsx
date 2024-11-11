// src/components/Dashboard/Filter/ShelfFilter.tsx
import { Input } from "@/components/ui/input";

type ShelfFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ShelfFilter({ value, onChange }: ShelfFilterProps) {
  return (
    <Input
      placeholder="棚番"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
