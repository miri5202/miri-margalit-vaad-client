interface PaginationProps {
  page: number;                         
  pages: number;                     
  onChange: (page: number) => void;   
}

function Pagination({ page, pages, onChange }: PaginationProps) {

  if (pages <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        ›
      </button>
      <span>
        עמוד {page} מתוך {pages}
      </span>
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>
        ‹
      </button>
    </div>
  );
}

export default Pagination;