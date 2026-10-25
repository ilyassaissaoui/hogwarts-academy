import assert from "node:assert/strict";
import { AcademyService } from "./academy-service";
import { SpellRepository } from "./spell-repository";
import { WizardRepository } from "./wizard-repository";
import type { EntityReader } from "./repository-contracts";
import type { Spell } from "./types";

export function runServiceExamples(): void {
  console.log("\n--- Academy service ---");

  const wizards = new WizardRepository();
  const spells = new SpellRepository();

  const harry = wizards.create({
    name: "Harry Potter",
    house: "Gryffindor",
    level: 5,
    active: true
  });

  const hermione = wizards.create({
    name: "Hermione Granger",
    house: "Gryffindor",
    level: 8,
    active: true
  });

  wizards.create({
    name: "Draco Malfoy",
    house: "Slytherin",
    level: 6,
    active: true
  });

  spells.add({
    id: 101,
    name: "Expelliarmus",
    category: "attack",
    power: 80
  });

  const academy = new AcademyService(wizards, spells);

  const castArguments: Parameters<AcademyService["castSpell"]> = [
    harry.id,
    101
  ];

  const castResult: ReturnType<AcademyService["castSpell"]> =
    academy.castSpell(...castArguments);

  assert.equal(castResult, "Harry Potter casts Expelliarmus!");

  assert.throws(
    () => academy.castSpell(999, 101),
    new Error("Wizard not found")
  );

  assert.throws(
    () => academy.castSpell(harry.id, 999),
    new Error("Spell not found")
  );

  assert.deepEqual(academy.findByHouse("Gryffindor"), [
    {
      id: harry.id,
      name: "Harry Potter",
      house: "Gryffindor"
    },
    {
      id: hermione.id,
      name: "Hermione Granger",
      house: "Gryffindor"
    }
  ]);

  assert.deepEqual(academy.findByHouse("Hufflepuff"), []);

  assert.equal(academy.updateWizard(harry.id, { level: 6 }), true);
  assert.equal(wizards.findById(harry.id)?.level, 6);
  assert.equal(academy.updateWizard(999, { level: 6 }), false);

  const emptySpellReader: EntityReader<Spell> = {
    findById(id: number): Spell | undefined {
      return undefined;
    }
  };

  const academyWithoutSpells = new AcademyService(
    wizards,
    emptySpellReader
  );

  assert.throws(
    () => academyWithoutSpells.castSpell(harry.id, 101),
    new Error("Spell not found")
  );

  console.log(castResult);
  console.log("Gryffindor summaries:", academy.findByHouse("Gryffindor"));
  console.log("Updated Harry level:", wizards.findById(harry.id)?.level);
  console.log("Alternative spell reader accepted.");
  console.log("All academy service checks passed.");
}