import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateSemesterSummary,
  finalDGPA,
  gpaToPercentage,
  percentageToGpa,
  yearlyYGPAs,
} from "./core.ts";

const regular = [
  { sem: 1, sgpa: "8", credits: "20" },
  { sem: 2, sgpa: "8.5", credits: "20" },
  { sem: 3, sgpa: "7", credits: "20" },
  { sem: 4, sgpa: "7.5", credits: "20" },
  { sem: 5, sgpa: "8", credits: "20" },
  { sem: 6, sgpa: "8.5", credits: "20" },
  { sem: 7, sgpa: "9", credits: "20" },
  { sem: 8, sgpa: "9.5", credits: "20" },
];
const lateral = regular.filter((x) => x.sem >= 3);

describe("MAKAUT calculator core", () => {
  it("credit-weights CGPA", () => {
    const cgpa = calculateSemesterSummary([
      { sem: 3, sgpa: "7.36", credits: "22" },
      { sem: 4, sgpa: "7.71", credits: "21" },
    ]).cgpa;
    assert.ok(cgpa !== null);
    assert.ok(Math.abs(cgpa - 323.83 / 43) < 1e-12);
  });

  it("computes lateral yearly YGPAs", () => {
    assert.deepEqual(
      yearlyYGPAs(lateral, "lateral").map((x) => Number(x!.toFixed(4))),
      [7.25, 8.25, 9.25],
    );
  });

  it("computes regular DGPA", () => {
    assert.equal(Number(finalDGPA(regular, "regular")!.toFixed(4)), 8.35);
  });

  it("computes lateral DGPA", () => {
    assert.equal(Number(finalDGPA(lateral, "lateral")!.toFixed(4)), 8.375);
  });

  it("holds conversion boundaries", () => {
    assert.equal(gpaToPercentage(10), 92.5);
    assert.equal(gpaToPercentage(0.74), null);
    assert.equal(percentageToGpa(92.5), 10);
    assert.equal(percentageToGpa(95), null);
  });

  it("withholds DGPA until every required semester is complete", () => {
    const incomplete = regular.map((row) =>
      row.sem === 8 ? { ...row, sgpa: "" } : row,
    );
    assert.equal(finalDGPA(incomplete, "regular"), null);
  });
});
