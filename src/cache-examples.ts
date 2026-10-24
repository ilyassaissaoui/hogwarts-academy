import assert from "node:assert/strict";
import { SpellCalculator } from "./spell-calculator";

export function runCacheExamples(): void {
  const firstCalculator = new SpellCalculator();
  const secondCalculator = new SpellCalculator();

  console.log("\n--- Spell calculation cache ---");

  assert.equal(firstCalculator.calculatePower(10, 3), 30);
  assert.equal(firstCalculator.getCalculationCount(), 1);

  assert.equal(firstCalculator.calculatePower(10, 3), 30);
  assert.equal(firstCalculator.getCalculationCount(), 1);

  assert.equal(firstCalculator.calculatePower(5, 2), 10);
  assert.equal(firstCalculator.getCalculationCount(), 2);

  assert.equal(secondCalculator.getCalculationCount(), 0);

  assert.equal(secondCalculator.calculatePower(10, 3), 30);
  assert.equal(secondCalculator.getCalculationCount(), 1);

  assert.equal(secondCalculator.calculatePower(10, 3), 30);
  assert.equal(secondCalculator.getCalculationCount(), 1);

  assert.equal(firstCalculator.calculatePower(0, 3), 0);
  assert.equal(firstCalculator.getCalculationCount(), 3);

  assert.equal(firstCalculator.calculatePower(0, 3), 0);
  assert.equal(firstCalculator.getCalculationCount(), 3);

  assert.equal(firstCalculator.calculatePower(-0, 3), -0);
  assert.equal(firstCalculator.getCalculationCount(), 4);

  assert.throws(
    () => firstCalculator.calculatePower(Number.NaN, 3),
    new Error("Cache arguments must be finite numbers")
  );

  assert.throws(
    () => firstCalculator.calculatePower(10, Number.POSITIVE_INFINITY),
    new Error("Cache arguments must be finite numbers")
  );

  assert.equal(firstCalculator.getCalculationCount(), 4);
  assert.equal(secondCalculator.getCalculationCount(), 1);

  console.log(
    "First calculator executions:",
    firstCalculator.getCalculationCount()
  );

  console.log(
    "Second calculator executions:",
    secondCalculator.getCalculationCount()
  );

  console.log("All cache checks passed.");
}
