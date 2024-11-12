import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortableTableHeadProps = {
  children: React.ReactNode;
  sortKey: string;
  currentSortKey: string;
  direction: "asc" | "desc";
  onSort: (sortKey: string) => void;
  className?: string;
};

const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  children,
  sortKey,
  currentSortKey,
  direction,
  onSort,
}) => {
  return (
    <th
      className="cursor-pointer bg-gray-100 text-gray-700 font-semibold"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {children}
        {currentSortKey === sortKey && (
          direction === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )
        )}
      </div>
    </th>
  );
};

export default SortableTableHead;
