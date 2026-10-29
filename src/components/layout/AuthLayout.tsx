import type { ReactNode } from "react";
import BuildingArt from "../ui/BuildingArt";
import Logo from "../ui/Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

// מבנה עמודי הכניסה וההרשמה: כותרת והטופס מצד אחד, איור הבניין מהצד השני
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-paper p-4 sm:p-6 lg:flex lg:items-center">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-card shadow-sketch-lg">
        <header className="flex items-center gap-2 border-b-2 border-dashed border-line px-6 py-3 font-hand text-xl font-extrabold sm:px-8">
          <Logo />
          ועד בית
        </header>

        <div className="grid items-center gap-6 px-6 py-6 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:px-14 lg:py-8">
          <div className="min-w-0">
            <h1 className="mb-2 text-4xl leading-tight lg:text-5xl">
              כל הבניין <br className="sm:hidden" />
              <span className="bg-marker px-1">
                בכף היד.
              </span>
            </h1>
            <p className="mb-5 max-w-[46ch] text-muted">
              דמי ועד, הוצאות והודעות לדיירים - במקום אחד. כל דייר רואה לאן הולך הכסף, והוועד יודע מי כבר שילם.
            </p>
            {children}
          </div>
          {/* האיור לא גבוה מ-60% מגובה המסך, כדי שכל העמוד ייכנס בלי גלילה */}
          <div className="mx-auto hidden w-full max-w-[60vh] lg:block">
            <BuildingArt />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
