import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCalcStore } from "@/lib/calc/store";
import { AppHeader } from "./app-header";
import { ReferenceSheet } from "./reference-sheet";
import { ResultGauge } from "./result-gauge";
import { SemesterLedger } from "./semester-ledger";
import { Workbench } from "./workbench";

export function LedgerApp() {
  const [refOpen, setRefOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("makaut-ledger-theme");
    const nextTheme =
      savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    const result = useCalcStore.persist.rehydrate();
    void Promise.resolve(result).then(() => {
      useCalcStore.getState().setHydrated(true);
    });
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("makaut-ledger-theme", nextTheme);
  }

  return (
    <TooltipProvider>
      <div className="relative min-h-dvh">
        <AppHeader
          onOpenReference={() => setRefOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-5 lg:px-6">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="order-2 lg:order-1">
              <SemesterLedger />
            </div>
            <div className="order-1 lg:order-2">
              <ResultGauge />
            </div>
          </div>
          <Workbench />
        </main>
        <footer className="no-print border-t border-line">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <p>MAKAUT Ledger · Independent student utility · No affiliation with MAKAUT.</p>
            <p>Work is saved in this browser only.</p>
          </div>
        </footer>
        <ReferenceSheet open={refOpen} onOpenChange={setRefOpen} />
        <Toaster position="bottom-right" theme={theme} />
      </div>
    </TooltipProvider>
  );
}
