// עזרים לעיצוב עם Tailwind: מחרוזות class שחוזרות בהרבה קומפוננטות,
// כדי שכל הכפתורים, השדות והכרטיסים באתר ייראו אותו דבר.

// מחבר classes ומדלג על ריקים: cn("a", isOn && "b") ← "a b" או "a"
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type ButtonVariant = "primary" | "accent" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "sm";

const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-bold no-underline " +
  "transition-transform duration-100 disabled:cursor-not-allowed disabled:opacity-50";

// כפתור "מצויר": מסגרת עבה וצל שטוח. בלחיצה הוא "נכנס" לתוך הצל
const SKETCH =
  "border-[2.5px] border-ink hover:-translate-x-px hover:-translate-y-px " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-coral text-white",
  accent: "bg-sun text-deep",
  secondary: "bg-card text-ink",
  danger: "bg-card text-late-text dark:text-late",
  ghost: "border-2 border-transparent bg-transparent text-current hover:bg-ink/10",
};

const SIZES: Record<ButtonSize, string> = {
  md: "rounded-2xl px-5 py-2.5 text-base shadow-sketch",
  sm: "rounded-xl px-3 py-1.5 text-sm shadow-sketch-sm",
};

// className לכפתור או לקישור שנראה כמו כפתור: <button className={btn("primary")}>
export function btn(variant: ButtonVariant = "secondary", size: ButtonSize = "md"): string {
  if (variant === "ghost") {
    return cn(BUTTON_BASE, VARIANTS.ghost, size === "sm" ? "rounded-xl px-2.5 py-1 text-sm" : "rounded-2xl px-4 py-2");
  }
  return cn(BUTTON_BASE, SKETCH, VARIANTS[variant], SIZES[size]);
}

// שדה קלט / רשימת בחירה / תיבת טקסט
export function input(hasError = false): string {
  return cn(
    "w-full rounded-xl border-2 bg-card px-3 py-2.5 text-ink placeholder:text-muted/70",
    "focus:outline-none focus:ring-4",
    hasError ? "border-late-text focus:ring-late/40" : "border-ink focus:ring-sun/70"
  );
}

// כרטיס: מסגרת עבה ופינות מעוגלות
export const card = "rounded-3xl border-[2.5px] border-ink bg-card p-5 sm:p-6";

// עטיפה לטבלה (גלילה לצדדים בטלפון)
export const tableWrap = "overflow-x-auto rounded-3xl border-[2.5px] border-ink bg-card";
export const table = "w-full border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0";
export const th = "whitespace-nowrap border-b-2 border-ink px-4 py-3 text-start text-xs font-bold text-muted";
export const td = "border-b border-line px-4 py-3 align-middle";
