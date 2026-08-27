import { BookOpen, ListChecks, Moon, RotateCcw, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalcStore } from "@/lib/calc/store";
import type { Program } from "@/lib/calc/core";

function Mark() {
  return (
    <span
      aria-hidden="true"
      className="relative grid size-9 place-items-center rounded-sm bg-elevated shadow-[var(--shadow-border)]"
    >
      <svg viewBox="0 0 24 24" className="size-5 text-accent">
        <rect
          x="4.5"
          y="3.5"
          width="15"
          height="17"
          rx="1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 8.5h8M8 12h8M8 15.5h5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="text-sage"
        />
      </svg>
    </span>
  );
}

export function AppHeader({
  onOpenReference,
  theme,
  onToggleTheme,
}: {
  onOpenReference: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const program = useCalcStore((s) => s.program);
  const setProgram = useCalcStore((s) => s.setProgram);
  const loadSample = useCalcStore((s) => s.loadSample);
  const reset = useCalcStore((s) => s.reset);

  function choose(next: Program) {
    if (next === program) return;
    setProgram(next);
    toast(
      next === "regular" ? "Regular 4-year ledger" : "Lateral 3-year ledger",
    );
  }

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Mark />
            <div className="min-w-0 leading-tight">
              <p className="font-display text-lg tracking-tight text-fg">
                MAKAUT Ledger
              </p>
              <p className="truncate text-xs text-muted">
                SGPA · CGPA · YGPA · DGPA
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
            </Button>
            <Button
              variant="secondary"
              size="iconSm"
              onClick={onOpenReference}
              aria-label="Open rules and reference"
            >
              <BookOpen className="size-4" />
            </Button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Programme type"
          className="grid w-full grid-cols-2 gap-1 rounded-md bg-elevated p-1 shadow-[var(--shadow-border)] lg:w-auto lg:min-w-72"
        >
          {(
            [
              ["regular", "Regular", "8 semesters"],
              ["lateral", "Lateral", "Sem 3–8"],
            ] as const
          ).map(([id, label, hint]) => {
            const active = program === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => choose(id)}
                className={cn(
                  "flex h-11 flex-col items-center justify-center rounded-sm px-3 transition-colors duration-150",
                  active
                    ? "bg-surface text-fg shadow-[var(--shadow-border)]"
                    : "text-muted hover:text-fg",
                )}
              >
                <span className="text-sm font-medium leading-none">{label}</span>
                <span className="mt-1 text-micro tracking-widest text-subtle">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 lg:ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 lg:flex-none"
            onClick={() => {
              loadSample();
              toast("Sample semesters loaded");
            }}
          >
            <ListChecks className="size-3.5" />
            Sample
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 lg:flex-none"
            onClick={() => {
              reset();
              toast("Scores cleared");
            }}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={onOpenReference}
          >
            <BookOpen className="size-3.5" />
            Rules
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
