import assert from "node:assert/strict";
import { test } from "node:test";
import { AcademyService } from "../academy-service";
import { getSpellEvents, handleSpellCast } from "../event-handler";
import { SpellCalculator } from "../spell-calculator";
import { SpellRepository } from "../spell-repository";
import { isHouse, isSpell, isWizard } from "../validation";
import { WizardRepository } from "../wizard-repository";
import type { AcademyEvent, House, NewWizard } from "../types";

function createWizardData(
  name: string,
  house: House
): NewWizard {
  return {
    name,
    house,
    level: 5,
    active: true
  };
}

test("assigns unique identifiers after existing records", () => {
  const wizards = new WizardRepository();

  wizards.add({
    ...createWizardData("Luna Lovegood", "Ravenclaw"),
    id: 10
  });

  const harry = wizards.create(
    createWizardData("Harry Potter", "Gryffindor")
  );

  const hermione = wizards.create(
    createWizardData("Hermione Granger", "Gryffindor")
  );

  assert.equal(harry.id, 11);
  assert.equal(hermione.id, 12);

  assert.throws(
    () => wizards.add(harry),
    new Error("Identifier 11 already exists")
  );

  const identifiers = wizards.getAll().map(wizard => wizard.id);

  assert.equal(new Set(identifiers).size, 3);
  assert.equal(wizards.getAll().length, 3);
});

test("filters wizards by house", () => {
  const wizards = new WizardRepository();

  const harry = wizards.create(
    createWizardData("Harry Potter", "Gryffindor")
  );

  wizards.create(
    createWizardData("Draco Malfoy", "Slytherin")
  );

  assert.deepEqual(wizards.findByHouse("Gryffindor"), [harry]);
  assert.deepEqual(wizards.findByHouse("Hufflepuff"), []);
});

test("selects and handles only spell cast events", () => {
  const events: AcademyEvent[] = [
    { type: "level-up", wizardId: 1, newLevel: 6 },
    { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
    { type: "wizard-expelled", wizardId: 2 }
  ];

  const originalEvents = structuredClone(events);
  const spellEvents = getSpellEvents(events);

  assert.deepEqual(spellEvents, [
    { type: "spell-cast", wizardId: 1, spellName: "Lumos" }
  ]);

  assert.deepEqual(
    spellEvents.map(handleSpellCast),
    ["Wizard #1 cast Lumos"]
  );

  assert.deepEqual(events, originalEvents);
  assert.deepEqual(getSpellEvents([]), []);
});

test("accepts zero power and rejects negative power before insertion", () => {
  const spells = new SpellRepository();

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

  assert.throws(
    () => spells.add({
      id: 103,
      name: "Invalid Spell",
      category: "attack",
      power: -10
    }),
    new Error("Spell power cannot be negative")
  );

  assert.equal(spells.findById(101)?.power, 80);
  assert.equal(spells.findById(102)?.power, 0);
  assert.equal(spells.findById(103), undefined);
  assert.equal(spells.getAll().length, 2);
});

test("caches results including zero separately for each instance", () => {
  const firstCalculator = new SpellCalculator();
  const secondCalculator = new SpellCalculator();

  assert.equal(firstCalculator.calculatePower(10, 3), 30);
  assert.equal(firstCalculator.calculatePower(10, 3), 30);
  assert.equal(firstCalculator.getCalculationCount(), 1);

  assert.equal(firstCalculator.calculatePower(5, 2), 10);
  assert.equal(firstCalculator.getCalculationCount(), 2);

  assert.equal(firstCalculator.calculatePower(0, 3), 0);
  assert.equal(firstCalculator.calculatePower(0, 3), 0);
  assert.equal(firstCalculator.getCalculationCount(), 3);

  assert.equal(secondCalculator.getCalculationCount(), 0);
  assert.equal(secondCalculator.calculatePower(10, 3), 30);
  assert.equal(secondCalculator.calculatePower(10, 3), 30);
  assert.equal(secondCalculator.getCalculationCount(), 1);
  assert.equal(firstCalculator.getCalculationCount(), 3);
});

test("accepts exactly the four Hogwarts houses", () => {
  const houses: House[] = [
    "Gryffindor",
    "Slytherin",
    "Ravenclaw",
    "Hufflepuff"
  ];

  for (const house of houses) {
    assert.equal(isHouse(house), true);

    assert.equal(
      isWizard({
        ...createWizardData("Student", house),
        id: 1
      }),
      true
    );
  }

  for (const value of ["Durmstrang", "gryffindor", "", null, 42]) {
    assert.equal(isHouse(value), false);
  }
});

test("rejects malformed wizard and spell data", () => {
  const wizard = {
    ...createWizardData("Harry Potter", "Gryffindor"),
    id: 1
  };

  const invalidWizards: unknown[] = [
    null,
    [],
    {},
    { ...wizard, house: "Durmstrang" },
    { ...wizard, id: "1" },
    { ...wizard, name: " " },
    { ...wizard, level: Number.NaN },
    { ...wizard, active: "true" },
    { ...wizard, attributes: { wand: {} } }
  ];

  for (const candidate of invalidWizards) {
    assert.equal(isWizard(candidate), false);
  }

  const spell = {
    id: 101,
    name: "Lumos",
    category: "defense",
    power: 0
  };

  assert.equal(isSpell(spell), true);
  assert.equal(isSpell({ ...spell, power: -1 }), false);
  assert.equal(isSpell({ ...spell, power: Number.NaN }), false);
  assert.equal(isSpell({ ...spell, category: "unknown" }), false);
  assert.equal(isSpell(wizard), false);
  assert.equal(isWizard(spell), false);
});

test("protects stored data from external changes", () => {
  const wizards = new WizardRepository();

  const data: NewWizard = {
    ...createWizardData("Harry Potter", "Gryffindor"),
    attributes: {
      patronus: "Stag"
    }
  };

  const createdWizard = wizards.create(data);

  data.name = "Changed input";
  createdWizard.name = "Changed output";

  const retrievedWizard = wizards.findById(createdWizard.id);

  assert.ok(retrievedWizard);
  assert.ok(retrievedWizard.attributes);

  retrievedWizard.attributes.patronus = "Changed patronus";

  const storedWizard = wizards.findById(createdWizard.id);

  assert.equal(storedWizard?.name, "Harry Potter");
  assert.equal(storedWizard?.attributes?.patronus, "Stag");
});

test("uses injected repositories and handles missing records", () => {
  const wizards = new WizardRepository();
  const spells = new SpellRepository();

  const harry = wizards.create(
    createWizardData("Harry Potter", "Gryffindor")
  );

  spells.add({
    id: 101,
    name: "Expelliarmus",
    category: "attack",
    power: 80
  });

  const academy = new AcademyService(wizards, spells);

  assert.equal(
    academy.castSpell(harry.id, 101),
    "Harry Potter casts Expelliarmus!"
  );

  assert.throws(
    () => academy.castSpell(999, 101),
    new Error("Wizard not found")
  );

  assert.equal(academy.updateWizard(harry.id, { level: 6 }), true);
  assert.equal(wizards.findById(harry.id)?.level, 6);
  assert.equal(academy.updateWizard(999, { level: 6 }), false);

  const academyWithoutSpells = new AcademyService(wizards, {
    findById(): undefined {
      return undefined;
    }
  });

  assert.throws(
    () => academyWithoutSpells.castSpell(harry.id, 101),
    new Error("Spell not found")
  );
});