export type Program = "regular" | "lateral";

export type SemesterInput = {
  sem: number;
  sgpa: string;
  credits: string;
};

export const GRADE_POINTS = {
  O: 10,
  E: 9,
  A: 8,
  B: 7,
  C: 6,
  D: 5,
  F: 2,
  I: 2,
} as const;

export type Grade = keyof typeof GRADE_POINTS;

export const GRADE_TABLE: {
  grade: Grade;
  points: number;
  band: string;
  label: string;
}[] = [
  { grade: "O", points: 10, band: "90–100", label: "Outstanding" },
  { grade: "E", points: 9, band: "80–89", label: "Excellent" },
  { grade: "A", points: 8, band: "70–79", label: "Very Good" },
  { grade: "B", points: 7, band: "60–69", label: "Good" },
  { grade: "C", points: 6, band: "50–59", label: "Fair" },
  { grade: "D", points: 5, band: "40–49", label: "Below Average" },
  { grade: "F", points: 2, band: "Below 40", label: "Failed" },
  { grade: "I", points: 2, band: "—", label: "Incomplete" },
];

export const DEFAULT_KNOWN_CREDITS: Record<number, string> = {
  1: "17.5",
  2: "20.5",
  3: "22",
  4: "21",
  5: "24",
  6: "22",
  7: "",
  8: "",
};

export type YearGroup = {
  year: number;
  key: string;
  title: string;
  sems: number[];
  weight: number;
};

export function yearGroups(program: Program): YearGroup[] {
  if (program === "regular") {
    return [
      { year: 1, key: "y1", title: "First year", sems: [1, 2], weight: 1 },
      { year: 2, key: "y2", title: "Second year", sems: [3, 4], weight: 1 },
      { year: 3, key: "y3", title: "Third year", sems: [5, 6], weight: 1.5 },
      { year: 4, key: "y4", title: "Final year", sems: [7, 8], weight: 1.5 },
    ];
  }
  return [
    { year: 2, key: "y2", title: "Second year", sems: [3, 4], weight: 1 },
    { year: 3, key: "y3", title: "Third year", sems: [5, 6], weight: 1.5 },
    { year: 4, key: "y4", title: "Final year", sems: [7, 8], weight: 1.5 },
  ];
}

export function programSemesters(program: Program): number[] {
  return program === "regular"
    ? [1, 2, 3, 4, 5, 6, 7, 8]
    : [3, 4, 5, 6, 7, 8];
}

export function parseSgpa(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 10) return null;
  return n;
}

export function parseCredits(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function isSemesterComplete(row: SemesterInput): boolean {
  return parseSgpa(row.sgpa) !== null && parseCredits(row.credits) !== null;
}

export function calculateSemesterSummary(data: SemesterInput[]) {
  let totalCredits = 0;
  let totalIndex = 0;
  let completed = 0;
  for (const row of data) {
    const s = parseSgpa(row.sgpa);
    const c = parseCredits(row.credits);
    if (s === null || c === null) continue;
    totalCredits += c;
    totalIndex += s * c;
    completed += 1;
  }
  return {
    totalCredits,
    totalIndex,
    completed,
    cgpa: totalCredits ? totalIndex / totalCredits : null,
  };
}

export function yearYGPA(data: SemesterInput[], sems: number[]): number | null {
  let idx = 0;
  let credits = 0;
  for (const sem of sems) {
    const row = data.find((d) => d.sem === sem);
    if (!row) continue;
    const s = parseSgpa(row.sgpa);
    const c = parseCredits(row.credits);
    if (s === null || c === null) continue;
    idx += s * c;
    credits += c;
  }
  return credits ? idx / credits : null;
}

export function yearlyYGPAs(
  data: SemesterInput[],
  program: Program,
): (number | null)[] {
  return yearGroups(program).map((g) => yearYGPA(data, g.sems));
}

export function yearIsComplete(
  data: SemesterInput[],
  sems: number[],
): boolean {
  return sems.every((sem) => {
    const row = data.find((d) => d.sem === sem);
    return row ? isSemesterComplete(row) : false;
  });
}

export function finalDGPA(
  data: SemesterInput[],
  program: Program,
): number | null {
  const groups = yearGroups(program);
  if (!groups.every((g) => yearIsComplete(data, g.sems))) return null;
  const y = groups.map((g) => yearYGPA(data, g.sems));
  if (y.some((v) => v === null)) return null;
  const yy = y as number[];
  if (program === "regular") {
    return (yy[0]! + yy[1]! + 1.5 * yy[2]! + 1.5 * yy[3]!) / 5;
  }
  return (yy[0]! + 1.5 * yy[1]! + 1.5 * yy[2]!) / 4;
}

export function gpaToPercentage(gpa: number | null | string): number | null {
  const g = Number(gpa);
  if (!Number.isFinite(g) || g < 0.75 || g > 10) return null;
  return (g - 0.75) * 10;
}

export function percentageToGpa(pct: number | string): number | null {
  const p = Number(pct);
  if (!Number.isFinite(p) || p < 0 || p > 92.5) return null;
  return p / 10 + 0.75;
}

export function formatCredits(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatGpa(n: number | null): string {
  return n === null ? "—" : n.toFixed(2);
}

export function bandFromGpa(gpa: number): { letter: Grade; label: string } {
  if (gpa >= 9) return { letter: "O", label: "Outstanding" };
  if (gpa >= 8) return { letter: "E", label: "Excellent" };
  if (gpa >= 7) return { letter: "A", label: "Very Good" };
  if (gpa >= 6) return { letter: "B", label: "Good" };
  if (gpa >= 5) return { letter: "C", label: "Fair" };
  if (gpa >= 4) return { letter: "D", label: "Below Average" };
  return { letter: "F", label: "Failed" };
}

export function subjectSgpa(rows: { grade: string; credits: string }[]): {
  sgpa: number | null;
  credits: number;
  index: number;
} {
  let idx = 0;
  let credits = 0;
  for (const row of rows) {
    const pts = GRADE_POINTS[row.grade as Grade];
    const c = parseCredits(row.credits);
    if (pts === undefined || c === null) continue;
    idx += pts * c;
    credits += c;
  }
  return { sgpa: credits ? idx / credits : null, credits, index: idx };
}

export function missingSemesters(
  data: SemesterInput[],
  program: Program,
): number[] {
  return programSemesters(program).filter((sem) => {
    const row = data.find((d) => d.sem === sem);
    return !row || !isSemesterComplete(row);
  });
}

export function resultSummaryText(opts: {
  program: Program;
  cgpa: number | null;
  credits: number;
  dgpa: number | null;
  pct: number | null;
}): string {
  const kind = opts.program === "regular" ? "Regular" : "Lateral";
  return [
    `MAKAUT Ledger · ${kind} B.Tech`,
    `CGPA: ${formatGpa(opts.cgpa)}`,
    `Credits: ${formatCredits(opts.credits)}`,
    `Final DGPA: ${formatGpa(opts.dgpa)}`,
    `Percentage equivalent: ${opts.pct === null ? "—" : `${opts.pct.toFixed(2)}%`}`,
  ].join("\n");
}

export const SAMPLE: Record<Program, SemesterInput[]> = {
  regular: [
    { sem: 1, sgpa: "", credits: "" },
    { sem: 2, sgpa: "", credits: "" },
    { sem: 3, sgpa: "7.36", credits: "22" },
    { sem: 4, sgpa: "7.71", credits: "21" },
    { sem: 5, sgpa: "7.83", credits: "24" },
    { sem: 6, sgpa: "7.73", credits: "22" },
    { sem: 7, sgpa: "", credits: "" },
    { sem: 8, sgpa: "", credits: "" },
  ],
  lateral: [
    { sem: 3, sgpa: "7.36", credits: "22" },
    { sem: 4, sgpa: "7.71", credits: "21" },
    { sem: 5, sgpa: "7.83", credits: "24" },
    { sem: 6, sgpa: "7.73", credits: "22" },
    { sem: 7, sgpa: "", credits: "" },
    { sem: 8, sgpa: "", credits: "" },
  ],
};

export function emptySemesters(
  program: Program,
  known: Record<number, string>,
): SemesterInput[] {
  return programSemesters(program).map((sem) => ({
    sem,
    sgpa: "",
    credits: known[sem] || "",
  }));
}

export function withKnownCredits(
  rows: SemesterInput[],
  known: Record<number, string>,
): SemesterInput[] {
  return rows.map((row) => ({
    ...row,
    credits: row.credits || known[row.sem] || "",
  }));
}
