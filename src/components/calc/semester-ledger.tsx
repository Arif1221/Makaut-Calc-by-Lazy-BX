import { Eraser } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatGpa,
  isSemesterComplete,
  parseCredits,
  parseSgpa,
  yearGroups,
  yearIsComplete,
  yearYGPA,
} from "@/lib/calc/core";
import { useCalcStore } from "@/lib/calc/store";
import { cn } from "@/lib/utils";

export function SemesterLedger() {
  const program = useCalcStore((s) => s.program);
  const semesters = useCalcStore((s) => s.semesters);
  const updateSemester = useCalcStore((s) => s.updateSemester);
  const clearSemester = useCalcStore((s) => s.clearSemester);
  const groups = yearGroups(program);

  return (
    <section className="print-ink rounded-xl bg-surface/80 p-3 shadow-[var(--shadow-border)] sm:p-4">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-subtle">
            Semester ledger
          </p>
          <h2 className="font-display text-2xl tracking-tight text-fg">
            Enter completed terms
          </h2>
        </div>
        <p className="hidden max-w-48 text-right text-xs text-muted sm:block">
          Credits are prefilled from the GCETTS IT reference where known.
        </p>
      </div>

      <div className="space-y-3">
        {groups.map((group) => {
          const ygpa = yearYGPA(semesters, group.sems);
          const done = yearIsComplete(semesters, group.sems);
          return (
            <article
              key={group.key}
              className="rounded-lg bg-elevated/60 p-3 shadow-[var(--shadow-border)]"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-display text-xl italic tracking-tight text-fg">
                    {group.title}
                  </h3>
                  <span className="font-mono text-micro text-subtle">
                    Y{group.year}
                  </span>
                  {group.weight > 1 ? (
                    <span className="rounded-sm bg-sage/15 px-1.5 py-0.5 font-mono text-micro text-sage">
                      ×{group.weight}
                    </span>
                  ) : null}
                </div>
                <p
                  className={cn(
                    "font-mono text-sm tabular-nums",
                    done ? "text-fg" : "text-muted",
                  )}
                >
                  <span className="mr-2 text-micro tracking-widest text-subtle uppercase">
                    YGPA
                  </span>
                  {formatGpa(ygpa)}
                </p>
              </div>

              <div className="relative pl-4">
                <span
                  aria-hidden="true"
                  className="absolute top-3 bottom-3 left-[7px] w-px bg-line"
                />
                <div className="space-y-2">
                  {group.sems.map((sem) => {
                    const row = semesters.find((s) => s.sem === sem);
                    if (!row) return null;
                    const complete = isSemesterComplete(row);
                    const sgpaInvalid =
                      row.sgpa !== "" && parseSgpa(row.sgpa) === null;
                    const creditInvalid =
                      row.credits !== "" && parseCredits(row.credits) === null;
                    return (
                      <div
                        key={sem}
                        className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-2"
                      >
                        <div className="relative flex h-11 items-center">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute top-1/2 left-[-13px] size-2 -translate-y-1/2 rounded-full",
                              complete ? "bg-sage" : "bg-line",
                            )}
                          />
                          <div className="flex h-11 w-12 items-center justify-center rounded-sm bg-bg font-mono text-xs tabular-nums text-muted shadow-[var(--shadow-border)]">
                            {String(sem).padStart(2, "0")}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`sgpa-${sem}`} className="mb-1">
                            SGPA
                          </Label>
                          <Input
                            id={`sgpa-${sem}`}
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={10}
                            step={0.01}
                            placeholder="7.80"
                            value={row.sgpa}
                            aria-invalid={sgpaInvalid}
                            className={cn(
                              sgpaInvalid &&
                                "border-danger/50 focus:border-danger/60 focus:ring-danger/20",
                            )}
                            onChange={(e) =>
                              updateSemester(sem, { sgpa: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`credits-${sem}`} className="mb-1">
                            Credits
                          </Label>
                          <Input
                            id={`credits-${sem}`}
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step={0.5}
                            placeholder="22"
                            value={row.credits}
                            aria-invalid={creditInvalid}
                            className={cn(
                              creditInvalid &&
                                "border-danger/50 focus:border-danger/60 focus:ring-danger/20",
                            )}
                            onChange={(e) =>
                              updateSemester(sem, { credits: e.target.value })
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-subtle hover:text-danger"
                          aria-label={`Clear semester ${sem}`}
                          onClick={() => {
                            clearSemester(sem);
                            toast(`Semester ${sem} cleared`);
                          }}
                        >
                          <Eraser className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
