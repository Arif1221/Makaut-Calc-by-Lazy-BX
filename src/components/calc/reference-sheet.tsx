import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GRADE_TABLE } from "@/lib/calc/core";

const FAQS = [
  {
    q: "Does the calculator save my results?",
    a: "Yes. Semester entries, programme selection, known credits and subject rows stay in this browser. Nothing is sent to a server.",
  },
  {
    q: "Why isn’t CGPA the simple average of SGPAs?",
    a: "MAKAUT’s cumulative calculation is credit-weighted. A 24-credit semester contributes more than an 18-credit semester.",
  },
  {
    q: "What happens if I enter 95% in Percentage → GPA?",
    a: "It is rejected. Under the stated formula, GPA 10 corresponds to 92.50%, so a higher percentage cannot map onto the 10-point scale.",
  },
  {
    q: "Why does final DGPA stay blank?",
    a: "Every required semester must be complete. Regular programmes need Sem 1–8; lateral entry needs Sem 3–8.",
  },
  {
    q: "Is this an official MAKAUT calculator?",
    a: "No. It is an independent student utility. For formal applications, follow the receiving organisation and use official university records.",
  },
];

export function ReferenceSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Rules & reference</SheetTitle>
          <SheetDescription>
            Built around the method printed on MAKAUT grade cards. Not affiliated
            with the university.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 px-6 py-6">
          <section>
            <h3 className="font-display text-xl">Regular · 4-year B.Tech</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
              <li>Eight semesters: Sem 1–8.</li>
              <li>YGPA is the credit-weighted mean of each academic year.</li>
              <li>Running CGPA is cumulative credit index ÷ cumulative credits.</li>
            </ul>
            <p className="mt-3 rounded-md bg-bg px-3 py-2 font-mono text-xs text-fg shadow-[var(--shadow-border)]">
              DGPA = (Y1 + Y2 + 1.5 Y3 + 1.5 Y4) / 5
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl">Lateral · 3-year B.Tech</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
              <li>Six B.Tech semesters: Sem 3–8.</li>
              <li>Entry is at 2nd year; calculation starts with Sem 3.</li>
              <li>Diploma performance is not mixed into B.Tech CGPA.</li>
            </ul>
            <p className="mt-3 rounded-md bg-bg px-3 py-2 font-mono text-xs text-fg shadow-[var(--shadow-border)]">
              DGPA = (Y2 + 1.5 Y3 + 1.5 Y4) / 4
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl">Grade-point table</h3>
            <p className="mt-1 text-sm text-muted">
              Points as printed on the supplied MAKAUT grade cards.
            </p>
            <div className="mt-3 overflow-hidden rounded-md shadow-[var(--shadow-border)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-elevated text-micro tracking-widest text-subtle uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium">Grade</th>
                    <th className="px-3 py-2 font-medium">Points</th>
                    <th className="px-3 py-2 font-medium">Marks</th>
                    <th className="px-3 py-2 font-medium">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {GRADE_TABLE.map((row) => (
                    <tr key={row.grade} className="border-t border-line">
                      <td className="px-3 py-2 font-mono font-medium">
                        {row.grade}
                      </td>
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {row.points}
                      </td>
                      <td className="px-3 py-2 text-muted">{row.band}</td>
                      <td className="px-3 py-2 text-muted">{row.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              F = 2 and I = 2 are reproduced from the grade-point table on the
              supplied cards. If MAKAUT issues a newer official notice, verify
              before using this for a formal application.
            </p>
          </section>

          <section>
            <h3 className="font-display text-xl">FAQ</h3>
            <div className="mt-2 divide-y divide-line">
              {FAQS.map((item) => (
                <details key={item.q} className="py-3">
                  <summary className="cursor-pointer text-sm font-medium text-fg">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="text-xs text-subtle">
            Independent student utility.{" "}
            <a
              href="https://makautwb.ac.in/page.php?id=199"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage underline-offset-2 hover:underline"
            >
              MAKAUT Rules & Regulations
            </a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
