import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_KNOWN_CREDITS,
  SAMPLE,
  emptySemesters,
  type Program,
  type SemesterInput,
  withKnownCredits,
} from "./core";

export type SubjectRow = {
  id: string;
  grade: string;
  credits: string;
};

type CalcState = {
  hydrated: boolean;
  program: Program;
  semesters: SemesterInput[];
  knownCredits: Record<number, string>;
  subjects: SubjectRow[];
  setHydrated: (v: boolean) => void;
  setProgram: (program: Program) => void;
  updateSemester: (sem: number, patch: Partial<SemesterInput>) => void;
  clearSemester: (sem: number) => void;
  setKnownCredit: (sem: number, credits: string) => void;
  applyKnownCredits: () => void;
  loadSample: () => void;
  reset: () => void;
  addSubject: () => void;
  updateSubject: (id: string, patch: Partial<SubjectRow>) => void;
  removeSubject: (id: string) => void;
  clearSubjects: () => void;
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function blankSubjects(): SubjectRow[] {
  return [
    { id: "s1", grade: "", credits: "" },
    { id: "s2", grade: "", credits: "" },
    { id: "s3", grade: "", credits: "" },
  ];
}

export const useCalcStore = create<CalcState>()(
  persist(
    (set) => ({
      hydrated: false,
      program: "regular",
      semesters: emptySemesters("regular", DEFAULT_KNOWN_CREDITS),
      knownCredits: { ...DEFAULT_KNOWN_CREDITS },
      subjects: blankSubjects(),
      setHydrated: (v) => set({ hydrated: v }),
      setProgram: (program) =>
        set((state) => {
          const next = emptySemesters(program, state.knownCredits).map((row) => {
            const prev = state.semesters.find((s) => s.sem === row.sem);
            if (!prev) return row;
            return {
              ...row,
              sgpa: prev.sgpa,
              credits: prev.credits || row.credits,
            };
          });
          return { program, semesters: next };
        }),
      updateSemester: (sem, patch) =>
        set((state) => ({
          semesters: state.semesters.map((row) =>
            row.sem === sem ? { ...row, ...patch } : row,
          ),
        })),
      clearSemester: (sem) =>
        set((state) => ({
          semesters: state.semesters.map((row) =>
            row.sem === sem
              ? {
                  ...row,
                  sgpa: "",
                  credits: state.knownCredits[sem] || "",
                }
              : row,
          ),
        })),
      setKnownCredit: (sem, credits) =>
        set((state) => ({
          knownCredits: { ...state.knownCredits, [sem]: credits },
          semesters: state.semesters.map((row) => {
            if (row.sem !== sem) return row;
            if (row.sgpa) return row;
            return { ...row, credits };
          }),
        })),
      applyKnownCredits: () =>
        set((state) => ({
          semesters: state.semesters.map((row) =>
            row.credits
              ? row
              : { ...row, credits: state.knownCredits[row.sem] || "" },
          ),
        })),
      loadSample: () =>
        set((state) => ({
          semesters: withKnownCredits(SAMPLE[state.program], state.knownCredits),
        })),
      reset: () =>
        set((state) => ({
          semesters: emptySemesters(state.program, state.knownCredits),
          subjects: blankSubjects(),
        })),
      addSubject: () =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            { id: uid(), grade: "", credits: "" },
          ],
        })),
      updateSubject: (id, patch) =>
        set((state) => ({
          subjects: state.subjects.map((row) =>
            row.id === id ? { ...row, ...patch } : row,
          ),
        })),
      removeSubject: (id) =>
        set((state) => ({
          subjects:
            state.subjects.length <= 1
              ? [{ id: "s1", grade: "", credits: "" }]
              : state.subjects.filter((row) => row.id !== id),
        })),
      clearSubjects: () => set({ subjects: blankSubjects() }),
    }),
    {
      name: "makaut-ledger-v1",
      skipHydration: true,
      partialize: (state) => ({
        program: state.program,
        semesters: state.semesters,
        knownCredits: state.knownCredits,
        subjects: state.subjects,
      }),
    },
  ),
);
