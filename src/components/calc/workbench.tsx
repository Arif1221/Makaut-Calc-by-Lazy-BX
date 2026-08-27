import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GRADE_POINTS,
  gpaToPercentage,
  percentageToGpa,
  subjectSgpa,
} from "@/lib/calc/core";
import { useCalcStore } from "@/lib/calc/store";
import { cn } from "@/lib/utils";

export function Workbench() {
  return (
    <section className="no-print mt-6">
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-subtle">
            Bench
          </p>
          <h2 className="font-display text-2xl tracking-tight">
            Converters & subject SGPA
          </h2>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <GpaToPct />
        <PctToGpa />
        <SubjectTool />
      </div>
      <KnownCredits />
    </section>
  );
}

function ToolCard({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface/80 p-4 shadow-[var(--shadow-border)]">
      <p className="font-mono text-micro tracking-widest text-subtle uppercase">
        {kicker}
      </p>
      <h3 className="mt-1 font-display text-xl tracking-tight">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function GpaToPct() {
  const [gpa, setGpa] = useState("");
  const out = gpa === "" ? null : gpaToPercentage(gpa);
  const invalid = gpa !== "" && out === null;
  return (
    <ToolCard kicker="Formula" title="GPA → percentage">
      <Label htmlFor="gpa-in">GPA (0.75–10)</Label>
      <Input
        id="gpa-in"
        className="mt-1"
        type="number"
        inputMode="decimal"
        min={0.75}
        max={10}
        step={0.01}
        placeholder="7.66"
        value={gpa}
        onChange={(e) => setGpa(e.target.value)}
      />
      <p
        className={cn(
          "mt-3 font-display text-4xl tabular-nums tracking-tight",
          invalid ? "text-danger" : "text-fg",
        )}
      >
        {out === null ? (invalid ? "Out of range" : "—") : `${out.toFixed(2)}%`}
      </p>
      <p className="mt-1 text-xs text-muted">(GPA − 0.75) × 10</p>
    </ToolCard>
  );
}

function PctToGpa() {
  const [pct, setPct] = useState("");
  const n = Number(pct);
  const out = pct === "" ? null : percentageToGpa(pct);
  const tooHigh = pct !== "" && Number.isFinite(n) && n > 92.5;
  return (
    <ToolCard kicker="Inverse" title="Percentage → GPA">
      <Label htmlFor="pct-in">Percentage (0–92.50)</Label>
      <Input
        id="pct-in"
        className="mt-1"
        type="number"
        inputMode="decimal"
        min={0}
        max={92.5}
        step={0.01}
        placeholder="69.10"
        value={pct}
        onChange={(e) => setPct(e.target.value)}
      />
      <p
        className={cn(
          "mt-3 font-display text-4xl tabular-nums tracking-tight",
          tooHigh ? "text-danger" : "text-fg",
        )}
      >
        {out === null
          ? tooHigh
            ? "Not achievable"
            : "—"
          : `${out.toFixed(2)} GPA`}
      </p>
      <p className="mt-1 text-xs text-muted">
        92.50% is the ceiling for GPA 10.
      </p>
    </ToolCard>
  );
}

function SubjectTool() {
  const subjects = useCalcStore((s) => s.subjects);
  const addSubject = useCalcStore((s) => s.addSubject);
  const updateSubject = useCalcStore((s) => s.updateSubject);
  const removeSubject = useCalcStore((s) => s.removeSubject);
  const clearSubjects = useCalcStore((s) => s.clearSubjects);
  const result = useMemo(() => subjectSgpa(subjects), [subjects]);

  return (
    <ToolCard kicker="Semester" title="Subject SGPA">
      <div className="space-y-2">
        {subjects.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <div>
              <Label htmlFor={`grade-${row.id}`} className="sr-only">
                Grade
              </Label>
              <select
                id={`grade-${row.id}`}
                value={row.grade}
                onChange={(e) =>
                  updateSubject(row.id, { grade: e.target.value })
                }
                className="h-11 w-full rounded-sm border border-line bg-bg px-2 font-mono text-sm text-fg outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
              >
                <option value="">Grade</option>
                {Object.keys(GRADE_POINTS).map((g) => (
                  <option key={g} value={g}>
                    {g} · {GRADE_POINTS[g as keyof typeof GRADE_POINTS]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor={`subcr-${row.id}`} className="sr-only">
                Credits
              </Label>
              <Input
                id={`subcr-${row.id}`}
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                placeholder="Credits"
                value={row.credits}
                onChange={(e) =>
                  updateSubject(row.id, { credits: e.target.value })
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-subtle hover:text-danger"
              aria-label="Remove subject"
              onClick={() => removeSubject(row.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={addSubject}
          className="flex-1"
        >
          <Plus className="size-3.5" />
          Add subject
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearSubjects();
            toast("Subject rows cleared");
          }}
        >
          Clear
        </Button>
      </div>
      <p className="mt-3 font-display text-4xl tabular-nums tracking-tight">
        {result.sgpa === null ? "—" : result.sgpa.toFixed(2)}
      </p>
      <p className="mt-1 text-xs text-muted">
        {result.credits
          ? `Σ(GP × Cr) / ${result.credits} cr`
          : "Uses the grade-point table in Rules."}
      </p>
    </ToolCard>
  );
}

function KnownCredits() {
  const knownCredits = useCalcStore((s) => s.knownCredits);
  const setKnownCredit = useCalcStore((s) => s.setKnownCredit);
  const applyKnownCredits = useCalcStore((s) => s.applyKnownCredits);

  return (
    <details className="mt-3 rounded-xl bg-surface/60 p-4 shadow-[var(--shadow-border)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm text-fg [&::-webkit-details-marker]:hidden">
        <span>
          <span className="font-medium">Known credits · GCETTS IT</span>
          <span className="mt-0.5 block text-xs text-muted">
            Reference values only. A semester counts when both SGPA and credits
            are entered.
          </span>
        </span>
        <span className="font-mono text-micro tracking-widest text-sage uppercase">
          Edit
        </span>
      </summary>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((sem) => (
          <div key={sem}>
            <Label htmlFor={`known-${sem}`}>Sem {sem}</Label>
            <Input
              id={`known-${sem}`}
              className="mt-1 h-10"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              placeholder="—"
              value={knownCredits[sem] ?? ""}
              onChange={(e) => setKnownCredit(sem, e.target.value)}
            />
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={() => {
          applyKnownCredits();
          toast("Empty credit cells filled from the reference");
        }}
      >
        Apply to empty cells
      </Button>
    </details>
  );
}
