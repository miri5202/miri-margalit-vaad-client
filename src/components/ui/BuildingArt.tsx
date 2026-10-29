// איור לעמודי הכניסה וההרשמה: בניין עם חלונות מוארים, שמש, ענן ועץ
// (קישוט בלבד - הנתונים האמיתיים מוצגים בלוח הראשי)
function BuildingArt() {
  return (
    <div className="relative min-w-0">
      <svg viewBox="0 0 520 470" className="block h-auto w-full" role="img" aria-label="איור של בניין מגורים">
        <rect x="10" y="10" width="500" height="450" rx="40" className="fill-transparent" />
        <circle cx="430" cy="80" r="34" fill="#ffcf5c" stroke="var(--ink)" strokeWidth="3" />
        <path
          d="M60 110 q20 -24 44 -6 q18 -18 38 4 q22 0 18 18 h-104 q-14 -10 4 -16z"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth="3"
        />
        <rect x="140" y="120" width="240" height="320" rx="10" fill="var(--wall)" stroke="var(--ink)" strokeWidth="3.5" />
        <rect x="125" y="104" width="270" height="26" rx="8" fill="#ff7a5c" stroke="var(--ink)" strokeWidth="3.5" />
        <g stroke="var(--ink)" strokeWidth="3">
          <rect x="170" y="155" width="70" height="62" rx="8" fill="#ffcf5c" />
          <rect x="280" y="155" width="70" height="62" rx="8" fill="#ffcf5c" />
          <rect x="170" y="240" width="70" height="62" rx="8" fill="#ffcf5c" />
          <rect x="280" y="240" width="70" height="62" rx="8" fill="#dfe6ef" />
          <rect x="170" y="325" width="70" height="62" rx="8" fill="#ffcf5c" />
          <rect x="280" y="325" width="70" height="62" rx="8" fill="#ff9b9b" />
          <line x1="205" y1="155" x2="205" y2="217" />
          <line x1="315" y1="155" x2="315" y2="217" />
          <line x1="205" y1="240" x2="205" y2="302" />
          <line x1="315" y1="240" x2="315" y2="302" />
          <line x1="205" y1="325" x2="205" y2="387" />
          <line x1="315" y1="325" x2="315" y2="387" />
        </g>
        <rect x="236" y="392" width="48" height="48" rx="6" fill="#8fd0ff" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="275" cy="418" r="3" fill="var(--ink)" />
        <rect x="420" y="380" width="10" height="60" fill="#b07a4a" stroke="var(--ink)" strokeWidth="2.5" />
        <circle cx="425" cy="362" r="36" fill="#a8e6cf" stroke="var(--ink)" strokeWidth="3" />
        <line x1="40" y1="440" x2="480" y2="440" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M88 300 q30 -40 60 -10" fill="none" stroke="#ff7a5c" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 8" />
        <path d="M140 296 l10 4 -6 9" fill="none" stroke="#ff7a5c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M455 190 l6 14 l14 2 l-10 10 l3 14 l-13 -7 l-13 7 l3 -14 l-10 -10 l14 -2z"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* פתקים "מרחפים" מעל האיור */}
      <div className="absolute top-[8%] left-[2%] -rotate-6 rounded-xl border-2 border-ink bg-card px-3 py-1.5 font-hand text-sm font-semibold whitespace-nowrap shadow-sketch-sm">
        דירה 3 שילמה ✓
      </div>
      <div className="absolute top-[40%] left-0 hidden rotate-3 rounded-xl border-2 border-ink bg-sun px-3 py-1.5 font-hand text-sm font-semibold whitespace-nowrap text-deep shadow-sketch-sm sm:block">
        💡 חלון מואר = שולם
      </div>
      <div className="absolute right-0 bottom-[14%] rotate-[5deg] rounded-xl border-2 border-ink bg-mint px-3 py-1.5 font-hand text-sm font-semibold whitespace-nowrap text-deep shadow-sketch-sm">
        ההודעה נשלחה לכל הדיירים
      </div>
    </div>
  );
}

export default BuildingArt;
