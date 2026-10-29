import type { ReactNode } from "react";
import BuildingArt from "../ui/BuildingArt";
import Logo from "../ui/Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

// מבנה עמודי הכניסה וההרשמה: כותרת והטופס מצד אחד, איור הבניין מהצד השני
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-paper px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-card shadow-sketch-lg">
        <header className="flex items-center gap-2 border-b-2 border-dashed border-line px-6 py-4 font-hand text-xl font-extrabold sm:px-8">
          <Logo />
          ועד בית
        </header>

        <div className="grid items-center gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1fr_1.05fr]">
          <div className="min-w-0">
            <h1 className="mb-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              כל הבניין
              <br />
              <span className="bg-marker px-1">
                בכף היד.
              </span>
            </h1>
            <p className="mb-7 max-w-[42ch] text-lg text-muted">
              דמי ועד, הוצאות והודעות לדיירים - במקום אחד. כל דייר רואה לאן הולך הכסף, והוועד יודע מי כבר שילם.
            </p>
            {children}
          </div>
          <BuildingArt />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
