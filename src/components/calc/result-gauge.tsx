import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  bandFromGpa,
  calculateSemesterSummary,
  finalDGPA,
  formatCredits,
  formatGpa,
  gpaToPercentage,
  missingSemesters,
  resultSummaryText,
  yearGroups,
  yearYGPA,
} from "@/lib/calc/core";
import { useCalcStore } from "@/lib/calc/store";
import { cn } from "@/lib/utils";

function GaugeArc({ value }: { value: number | null }) {
  const r = 82;
  const circ = 2 * Math.PI * r;
  const usable = circ * 0.75;
  const filled =
    value == null ? 0 : Math.min(1, Math.max(0, value / 10)) * usable;

  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden="true">
      <g transform="rotate(135 100 100)">
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${usable} ${circ}`}
          className="text-line"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          className="text-accent transition-[stroke-dasharray] duration-500 ease-out-smooth"
        />
      </g>
    </svg>
  );
}

export function ResultGauge() {
  const program = useCalcStore((s) => s.program);
  const semesters = useCalcStore((s) => s.semesters);
  const summary = calculateSemesterSummary(semesters);
  const dgpa = finalDGPA(semesters, program);
  const pct = gpaToPercentage(summary.cgpa);
  const missing = missingSemesters(semesters, program);
  const groups = yearGroups(program);
  const latestYgpa = [...groups]
    .reverse()
    .map((g) => yearYGPA(semesters, g.sems))
    .find((v) => v !== null);
  const band = summary.cgpa !== null ? bandFromGpa(summary.cgpa) : null;
  const total = semesters.length;

  async function copy() {
    const text = resultSummaryText({
      program,
      cgpa: summary.cgpa,
      credits: summary.totalCredits,
      dgpa,
      pct,
    });
    try {
      await navigator.clipboard.writeText(text);
      toast("Result summary copied");
    } catch {
      toast("Copy is not available");
    }
  }

  return (
    <aside className="print-ink lg:sticky lg:top-24">
      <div className="rounded-xl bg-surface/90 p-4 shadow-[var(--shadow-border)] sm:p-5">
        <div className="flex items-center gap-4 lg:flex-col lg:items-stretch">
          <div className="relative mx-auto hidden size-52 sm:block lg:size-56">
            <GaugeArc value={summary.cgpa} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -translate-y-1">
              <p className="text-micro font-medium tracking-widest text-subtle uppercase">
                {program === "lateral" ? "CGPA · Lateral" : "Current CGPA"}
              </p>
              <p className="font-display text-5xl leading-none tracking-tight text-fg tabular-nums lg:text-6xl">
                {formatGpa(summary.cgpa)}
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 sm:hidden">
            <p className="text-micro font-medium tracking-widest text-subtle uppercase">
              {program === "lateral" ? "CGPA · Lateral" : "Current CGPA"}
            </p>
            <p className="font-display text-5xl leading-none tracking-tight text-fg tabular-nums">
              {formatGpa(summary.cgpa)}
            </p>
          </div>
        </div>

        <p className="mt-1 text-center text-sm text-muted">
          {summary.completed === 0
            ? "Enter a completed semester"
            : pct === null
              ? "Percentage conversion unavailable"
              : `${pct.toFixed(2)}% equivalent`}
        </p>

        {band && summary.cgpa !== null ? (
          <p className="mt-2 text-center font-mono text-xs text-sage">
            Band {band.letter} · {band.label}
          </p>
        ) : null}

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4">
          <Metric label="Credits" value={formatCredits(summary.totalCredits)} />
          <Metric label="Credit index" value={summary.totalIndex.toFixed(2)} />
          <Metric
            label="Completed"
            value={`${summary.completed} / ${total}`}
          />
          <Metric label="Latest YGPA" value={formatGpa(latestYgpa ?? null)} />
          <Metric label="Final DGPA" value={formatGpa(dgpa)} wide />
        </dl>

        <div className="mt-4 space-y-2">
          {groups.map((g) => {
            const yg = yearYGPA(semesters, g.sems);
            const width =
              yg == null ? 0 : Math.min(100, Math.max(6, (yg / 10) * 100));
            return (
              <div key={g.key} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-2">
                <span className="font-mono text-micro text-subtle">
                  Y{g.year}
                  {g.weight > 1 ? " ×1.5" : ""}
                </span>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={cn(
                      "h-full rounded-full bg-accent/80 transition-[width] duration-500 ease-out-smooth",
                      yg == null && "bg-line",
                    )}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-right font-mono text-micro tabular-nums text-muted">
                  {formatGpa(yg)}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 rounded-md bg-bg px-3 py-2 text-xs leading-relaxed text-muted shadow-[var(--shadow-border)]">
          {dgpa === null
            ? missing.length === total
              ? "Complete every required semester to unlock the final DGPA."
              : `Still needed: Sem ${missing.join(", ")}.`
            : "All required semesters are in. Final DGPA is ready."}
        </p>

        <div className="no-print mt-4 grid grid-cols-2 gap-2">
          <Button variant="primary" onClick={copy}>
            <Copy className="size-3.5" />
            Copy
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="size-3.5" />
            Print
          </Button>
        </div>
      </div>
    </aside>
  );
}

function Metric({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && "col-span-2 flex items-baseline justify-between")}>
      <dt className="text-micro tracking-widest text-subtle uppercase">
        {label}
      </dt>
      <dd className="font-mono text-sm tabular-nums text-fg">{value}</dd>
    </div>
  );
}
