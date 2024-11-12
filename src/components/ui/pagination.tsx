import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageLinks = [];

    if (totalPages <= 4) {
      // 全ページ表示（4ページ以下の場合）
      for (let i = 1; i <= totalPages; i++) {
        pageLinks.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-2 rounded-md ${currentPage === i ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            {i}
          </button>
        );
      }
    } else {
      // 最初、最後、現在のページと周囲のページの表示（4ページ以上の場合）
      if (currentPage > 2) {
        pageLinks.push(
          <button key={1} onClick={() => onPageChange(1)} className="px-3 py-2 rounded-md hover:bg-gray-200">
            1
          </button>
        );
        if (currentPage > 3) pageLinks.push(<span key="start-ellipsis"><MoreHorizontal className="h-4 w-4" /></span>);
      }

      // 現在のページとその周辺
      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        pageLinks.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-2 rounded-md ${currentPage === i ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) pageLinks.push(<span key="end-ellipsis"><MoreHorizontal className="h-4 w-4" /></span>);
        pageLinks.push(
          <button key={totalPages} onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-md hover:bg-gray-200">
            {totalPages}
          </button>
        );
      }
    }

    return pageLinks;
  };

  return (
    <nav className="flex items-center space-x-2 justify-center mt-6">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={`px-3 py-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={`px-3 py-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
