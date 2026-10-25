import assert from "node:assert/strict";
import { isHouse, isSpell, isWizard } from "./validation";
import type { House } from "./types";

export function runValidationExamples(): void {
  console.log("\n--- Type guard validation ---");

  const wizardData = {
    id: 1,
    name: "Harry Potter",
    house: "Gryffindor",
    level: 5,
    active: true
  };

  const validWizard: unknown = {
    ...wizardData,
    attributes: {
      patronus: "Stag",
      quidditchPlayer: true,
      housePoints: 20
    }
  };

  assert.equal(isWizard(validWizard), true);
  assert.equal(isWizard(wizardData), true);

  const houses: House[] = [
    "Gryffindor",
    "Slytherin",
    "Ravenclaw",
    "Hufflepuff"
  ];

  for (const house of houses) {
    assert.equal(isHouse(house), true);
    assert.equal(isWizard({ ...wizardData, house }), true);
  }

  assert.equal(isHouse("Durmstrang"), false);
  assert.equal(isHouse("gryffindor"), false);
  assert.equal(isHouse(" Gryffindor "), false);
  assert.equal(isHouse(42), false);

  const invalidWizards: Array<[string, unknown]> = [
    ["Null value", null],
    ["Undefined value", undefined],
    ["Array", []],
    ["String", "Harry Potter"],
    ["Empty object", {}],
    ["Missing name", { id: 1, house: "Gryffindor", level: 5, active: true }],
    ["Invalid house", { ...wizardData, house: "Durmstrang" }],
    ["Text identifier", { ...wizardData, id: "1" }],
    ["Zero identifier", { ...wizardData, id: 0 }],
    ["Empty name", { ...wizardData, name: "   " }],
    ["Negative level", { ...wizardData, level: -1 }],
    ["Fractional level", { ...wizardData, level: 2.5 }],
    ["NaN level", { ...wizardData, level: Number.NaN }],
    ["Infinite level", { ...wizardData, level: Number.POSITIVE_INFINITY }],
    ["Text boolean", { ...wizardData, active: "true" }],
    ["Null attributes", { ...wizardData, attributes: null }],
    ["Array attributes", { ...wizardData, attributes: [] }],
    ["Nested attributes", { ...wizardData, attributes: { wand: {} } }],
    ["Invalid attribute number", {
      ...wizardData,
      attributes: { score: Number.NaN }
    }]
  ];

  for (const [caseName, candidate] of invalidWizards) {
    assert.equal(isWizard(candidate), false, caseName);
  }

  const spellData = {
    id: 101,
    name: "Expelliarmus",
    category: "attack",
    power: 80
  };

  const validSpell: unknown = spellData;

  assert.equal(isSpell(validSpell), true);
  assert.equal(isSpell({ ...spellData, category: "defense" }), true);
  assert.equal(isSpell({ ...spellData, category: "healing" }), true);
  assert.equal(isSpell({ ...spellData, power: 0 }), true);

  assert.equal(isSpell(null), false);
  assert.equal(isSpell({}), false);
  assert.equal(isSpell({ ...spellData, category: "unknown" }), false);
  assert.equal(isSpell({ ...spellData, power: -10 }), false);
  assert.equal(isSpell({ ...spellData, power: "80" }), false);
  assert.equal(isSpell({ ...spellData, power: Number.NaN }), false);
  assert.equal(
    isSpell({ ...spellData, power: Number.POSITIVE_INFINITY }),
    false
  );

  assert.equal(isWizard(validSpell), false);
  assert.equal(isSpell(validWizard), false);

  if (isWizard(validWizard)) {
    console.log(`${validWizard.name} belongs to ${validWizard.house}.`);
  }

  if (isSpell(validSpell)) {
    console.log(`${validSpell.name} has power ${validSpell.power}.`);
  }

  console.log("All four houses accepted.");
  console.log("Invalid houses and malformed data rejected.");
  console.log("All type guard checks passed.");
}