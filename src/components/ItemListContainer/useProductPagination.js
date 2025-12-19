import { useCallback, useEffect, useMemo, useState } from 'react';

export function useProductPagination(productsData, options = {}) {
  const {
    mobileBreakpoint = 768,
    mobileItemsPerPage = 10,
    desktopItemsPerPage = 24,
  } = options;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= mobileBreakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [mobileBreakpoint]);

  const itemsPerPage = isMobile ? mobileItemsPerPage : desktopItemsPerPage;

  const [slice, setSlice] = useState({ startIndex: 0, endIndex: itemsPerPage });

  useEffect(() => {
    setSlice({ startIndex: 0, endIndex: itemsPerPage });
  }, [itemsPerPage]);

  const currentProducts = useMemo(() => {
    const safe = Array.isArray(productsData) ? productsData : [];
    return safe.slice(slice.startIndex, slice.endIndex);
  }, [productsData, slice.startIndex, slice.endIndex]);

  const handleSliceChange = useCallback(({ startIndex, endIndex }) => {
    setSlice((prev) =>
      prev.startIndex === startIndex && prev.endIndex === endIndex
        ? prev
        : { startIndex, endIndex }
    );
  }, []);

  return {
    isMobile,
    itemsPerPage,
    slice,
    currentProducts,
    handleSliceChange,
  };
}