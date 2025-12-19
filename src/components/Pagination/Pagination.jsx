import React, { useMemo, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import styles from './Pagination.module.scss';

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const pages = [...items].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const prev = pages[i - 1];
    if (i > 0 && p - prev > 1) out.push('...');
    out.push(p);
  }
  return out;
}

const Pagination = ({
  totalItems,
  itemsPerPage,
  onSliceChange,
  scrollToTop = true,
}) => {
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / Math.max(1, itemsPerPage || 1)));
  const [currentPage, setCurrentPage] = useState(1);
  const onSliceChangeRef = useRef(onSliceChange);

  // Reset/clamp when dataset/page-size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems, itemsPerPage]);

  useEffect(() => {
    onSliceChangeRef.current = onSliceChange;
  }, [onSliceChange]);

  useEffect(() => {
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    onSliceChangeRef.current?.({ currentPage: safePage, startIndex, endIndex, totalPages });

    if (safePage !== currentPage) setCurrentPage(safePage);
  }, [currentPage, totalPages, itemsPerPage]);

  const items = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const go = (page) => {
    setCurrentPage(page);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={styles.container} aria-label="Paginación">
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => canPrev && go(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Página anterior"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
        <span className={styles.navText}>Anterior</span>
      </button>

      <div className={styles.pages} role="list" aria-label="Páginas">
        {items.map((it, idx) => {
          if (it === '...') {
            return (
              <span key={`dots-${idx}`} className={styles.dots} aria-hidden="true">
                <FontAwesomeIcon icon={faEllipsis} />
              </span>
            );
          }

          const page = it;
          const active = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              role="listitem"
              className={`${styles.pageBtn} ${active ? styles.active : ''}`}
              onClick={() => go(page)}
              aria-current={active ? 'page' : undefined}
              aria-label={`Ir a la página ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.navBtn}
        onClick={() => canNext && go(currentPage + 1)}
        disabled={!canNext}
        aria-label="Página siguiente"
      >
        <span className={styles.navText}>Siguiente</span>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </nav>
  );
};

export default Pagination;