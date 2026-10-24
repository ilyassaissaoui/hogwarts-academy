import assert from "node:assert/strict";
import { SpellRepository } from "./spell-repository";

export function runSpellExamples(): void {
  const spells = new SpellRepository();

  console.log("\n--- Spell power validation ---");

  spells.add({
    id: 101,
    name: "Expelliarmus",
    category: "attack",
    power: 80
  });

  spells.add({
    id: 102,
    name: "Lumos",
    category: "defense",
    power: 0
  });

  assert.equal(spells.findById(101)?.power, 80);
  assert.equal(spells.findById(102)?.power, 0);

  assert.throws(
    () => spells.add({
      id: 103,
      name: "Invalid Spell",
      category: "attack",
      power: -10
    }),

  );

  assert.equal(spells.findById(103), undefined);
  assert.equal(spells.getAll().length, 2);

  assert.throws(
    () => spells.add({
      id: 104,
      name: "Invalid Power",
      category: "healing",
      power: Number.NaN
    }),

  );

  assert.throws(
    () => spells.add({
      id: 105,
      name: "Infinite Power",
      category: "attack",
      power: Number.POSITIVE_INFINITY
    }),

  );

  assert.throws(
    () => spells.add({
      id: 101,
      name: "Duplicate Spell",
      category: "defense",
      power: 20
    }),

  );

  assert.equal(spells.findById(104), undefined);
  assert.equal(spells.findById(105), undefined);
  assert.equal(spells.findById(101)?.name, "Expelliarmus");
  assert.equal(spells.getAll().length, 2);

  console.log("Stored spells:", spells.getAll());
  console.log("Positive power accepted.");
  console.log("Zero power accepted.");
  console.log("Negative power rejected without insertion.");
  console.log("All spell validation checks passed.");
}