import { btn } from "../../utils/ui";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button className={btn("secondary", "sm")} disabled={page === 1} onClick={() => onChange(page - 1)}>
        › הקודם
      </button>
      <span className="font-hand">
        עמוד {page} מתוך {pages}
      </span>
      <button className={btn("secondary", "sm")} disabled={page === pages} onClick={() => onChange(page + 1)}>
        הבא ‹
      </button>
    </div>
  );
}

export default Pagination;
