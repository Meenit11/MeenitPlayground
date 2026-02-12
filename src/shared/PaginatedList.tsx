import { ReactNode, useState } from 'react';

const DEFAULT_PAGE_SIZE = 6;

type Props<T> = {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, index: number) => ReactNode;
  keyFn: (item: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
  /** If set, used instead of itemClassName for each item */
  getItemClassName?: (item: T, index: number) => string;
};

export function PaginatedList<T>({
  items,
  pageSize = DEFAULT_PAGE_SIZE,
  renderItem,
  keyFn,
  emptyMessage = 'No items',
  className = '',
  itemClassName = '',
  getItemClassName
}: Props<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const slice = items.slice(start, start + pageSize);

  if (items.length === 0) {
    return (
      <p className="home-tagline" style={{ margin: 0 }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={className}>
      <ul className="player-list">
        {slice.map((item, i) => (
          <li
            key={keyFn(item, start + i)}
            className={getItemClassName ? getItemClassName(item, start + i) : itemClassName}
          >
            {renderItem(item, start + i)}
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            type="button"
            className="btn-ghost pagination-btn"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
          >
            ← Prev
          </button>
          <span className="pagination-label">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            className="btn-ghost pagination-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
