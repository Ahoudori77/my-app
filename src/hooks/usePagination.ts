import { useState, useCallback, useEffect } from 'react';

type FetchFunction<T> = (page: number, perPage: number) => Promise<{ items: T[]; totalItems: number }>;

export function usePagination<T>(fetchFunction: FetchFunction<T>, itemsPerPage = 10) {
  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchItems = useCallback(async () => {
    try {
      const { items, totalItems } = await fetchFunction(currentPage, itemsPerPage);
      setItems(items);
      setTotalItems(totalItems);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  }, [fetchFunction, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return { items, currentPage, totalPages, handlePageChange };
}
