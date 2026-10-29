import type { PaymentCellStatus } from "../../types";
import { apartmentLabel } from "../../utils/format";

export interface WindowInfo {
  apartment: number;
  isUnit: boolean;
  residents: string[];
  status: PaymentCellStatus;
  highlight?: boolean; // למשל: "הדירה שלי" אצל דייר
}

interface BuildingWindowsProps {
  windows: WindowInfo[];
  onSelect?: (w: WindowInfo) => void;
}

// הצבע של כל חלון לפי סטטוס התשלום. חלון מואר (צהוב) = שולם
const FILL: Record<PaymentCellStatus, string> = {
  paid: "#ffcf5c",
  partial: "url(#half-window)",
  pending: "#dfe6ef",
  late: "#ff9b9b",
  none: "var(--card)",
};

const STATUS_TEXT: Record<PaymentCellStatus, string> = {
  paid: "שולם",
  partial: "שולם חלקית",
  pending: "ממתין",
  late: "באיחור",
  none: "לא חויב",
};

const W = 70; // רוחב חלון
const H = 52; // גובה חלון
const GAP = 22;

// איור של הבניין: כל חלון הוא דירה, צבוע לפי מצב התשלום.
// דירה 1 למטה מימין, והמספרים עולים משמאל לימין ומלמטה למעלה. יחידות דיור - בתוספת בצד הבניין
function BuildingWindows({ windows, onSelect }: BuildingWindowsProps) {
  const apartments = windows.filter((w) => !w.isUnit).sort((a, b) => a.apartment - b.apartment);
  const units = windows.filter((w) => w.isUnit).sort((a, b) => a.apartment - b.apartment);

  const count = Math.max(apartments.length, 1);
  const cols = count <= 6 ? 2 : count <= 12 ? 3 : 4;
  const floors = Math.ceil(count / cols);

  const bWidth = cols * W + (cols + 1) * GAP;
  const bHeight = floors * (H + GAP) + GAP + 50; // 50 = קומת כניסה עם דלת
  const annexWidth = units.length > 0 ? 80 : 0;
  const margin = 24;
  const roof = 26;

  const buildingX = margin + annexWidth; // הבניין בצד ימין, התוספת משמאלו
  const top = margin + roof;
  const ground = top + bHeight;
  const viewWidth = buildingX + bWidth + margin;
  const viewHeight = ground + margin;

  function windowTitle(w: WindowInfo) {
    const who = w.residents.length > 0 ? w.residents.join(", ") : "אין דיירים רשומים";
    return `${apartmentLabel(w.apartment, w.isUnit)} · ${who} · ${STATUS_TEXT[w.status]}`;
  }

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className="mx-auto block h-auto max-h-[420px] w-full"
      role="img"
      aria-label="איור הבניין: כל חלון הוא דירה, לפי מצב התשלום"
    >
      <defs>
        <linearGradient id="half-window" x1="0" y1="0" x2="1" y2="1">
          <stop offset="50%" stopColor="#ffcf5c" />
          <stop offset="50%" stopColor="#dfe6ef" />
        </linearGradient>
      </defs>

      {/* גוף הבניין והגג */}
      <rect x={buildingX} y={top} width={bWidth} height={bHeight} rx="10" fill="var(--wall)" stroke="var(--ink)" strokeWidth="3.5" />
      <rect x={buildingX - 14} y={top - roof} width={bWidth + 28} height={roof} rx="8" fill="#ff7a5c" stroke="var(--ink)" strokeWidth="3.5" />

      {/* דלת */}
      <rect x={buildingX + bWidth / 2 - 22} y={ground - 46} width="44" height="46" rx="6" fill="#8fd0ff" stroke="var(--ink)" strokeWidth="3" />
      <circle cx={buildingX + bWidth / 2 + 12} cy={ground - 22} r="3" fill="var(--ink)" />

      {/* חלונות הדירות */}
      {apartments.map((w, i) => {
        const floor = Math.floor(i / cols); // 0 = קומה תחתונה
        const pos = i % cols; // 0 = הכי ימני
        const x = buildingX + bWidth - GAP - W - pos * (W + GAP);
        const y = ground - 50 - (floor + 1) * (H + GAP);
        return (
          <g
            key={`a-${w.apartment}`}
            onClick={onSelect ? () => onSelect(w) : undefined}
            className={onSelect ? "cursor-pointer" : undefined}
          >
            <title>{windowTitle(w)}</title>
            <rect
              x={x}
              y={y}
              width={W}
              height={H}
              rx="8"
              fill={FILL[w.status]}
              stroke="var(--ink)"
              strokeWidth={w.highlight ? 5 : 3}
            />
            <text
              x={x + W / 2}
              y={y + H / 2 + 7}
              textAnchor="middle"
              fontFamily="Rubik, sans-serif"
              fontWeight="700"
              fontSize="20"
              fill={w.status === "none" ? "var(--ink)" : "#23304d"}
            >
              {w.apartment}
            </text>
            {w.highlight && (
              <text x={x + W / 2} y={y - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ink)">
                הדירה שלי
              </text>
            )}
          </g>
        );
      })}

      {/* תוספת: יחידות הדיור */}
      {units.length > 0 && (
        <>
          <rect
            x={margin}
            y={ground - (units.length * 56 + 16)}
            width={annexWidth}
            height={units.length * 56 + 16}
            rx="8"
            fill="var(--wall)"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          {units.map((w, i) => {
            const x = margin + 12;
            const y = ground - (i + 1) * 56;
            return (
              <g
                key={`u-${w.apartment}`}
                onClick={onSelect ? () => onSelect(w) : undefined}
                className={onSelect ? "cursor-pointer" : undefined}
              >
                <title>{windowTitle(w)}</title>
                <rect
                  x={x}
                  y={y}
                  width={annexWidth - 24}
                  height="42"
                  rx="6"
                  fill={FILL[w.status]}
                  stroke="var(--ink)"
                  strokeWidth={w.highlight ? 5 : 3}
                />
                <text
                  x={x + (annexWidth - 24) / 2}
                  y={y + 27}
                  textAnchor="middle"
                  fontFamily="Rubik, sans-serif"
                  fontWeight="700"
                  fontSize="15"
                  fill={w.status === "none" ? "var(--ink)" : "#23304d"}
                >
                  {w.apartment}א
                </text>
              </g>
            );
          })}
        </>
      )}

      {/* קו הקרקע */}
      <line x1="8" y1={ground} x2={viewWidth - 8} y2={ground} stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// מקרא הצבעים מתחת לאיור
export function WindowsLegend() {
  const items: { status: PaymentCellStatus; className: string }[] = [
    { status: "paid", className: "bg-sun" },
    { status: "partial", className: "bg-half" },
    { status: "pending", className: "bg-pending" },
    { status: "late", className: "bg-late" },
  ];
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {items.map((item) => (
        <span key={item.status} className="inline-flex items-center gap-1.5">
          <i className={`inline-block size-4 rounded border-2 border-ink ${item.className}`} />
          {STATUS_TEXT[item.status]}
        </span>
      ))}
    </div>
  );
}

export default BuildingWindows;
