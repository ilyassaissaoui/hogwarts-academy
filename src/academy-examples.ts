import assert from "node:assert/strict";
import "./type-examples";
import { WizardRepository } from "./wizard-repository";
import { getSpellEvents, handleSpellCast } from "./event-handler";
import type {
  AcademyEvent,
  NewWizard,
  WizardUpdate
} from "./types";

const wizards = new WizardRepository();

const harryData: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  attributes: {
    patronus: "Stag"
  }
};

const harry = wizards.create(harryData);

const hermione = wizards.create({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});

const draco = wizards.create({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true
});

assert.deepEqual(
  [harry.id, hermione.id, draco.id],
  [1, 2, 3]
);

const gryffindorWizards = wizards.findByHouse("Gryffindor");

assert.deepEqual(
  gryffindorWizards.map(wizard => wizard.name),
  ["Harry Potter", "Hermione Granger"]
);

assert.deepEqual(wizards.findByHouse("Ravenclaw"), []);

const wizardUpdate: WizardUpdate = {
  level: 6
};

assert.equal(wizards.update(harry.id, wizardUpdate), true);
assert.equal(wizards.findById(harry.id)?.level, 6);
assert.equal(wizards.findById(harry.id)?.id, harry.id);
assert.equal(wizards.update(999, wizardUpdate), false);
assert.equal(wizards.findById(999), undefined);

assert.throws(
  () => wizards.add(harry),

);

assert.equal(wizards.getAll().length, 3);

harryData.name = "Changed outside the repository";
harry.name = "Changed returned wizard";

assert.equal(wizards.findById(harry.id)?.name, "Harry Potter");

const retrievedHarry = wizards.findById(harry.id);

assert.ok(retrievedHarry);
assert.ok(retrievedHarry.attributes);

retrievedHarry.attributes.patronus = "Changed patronus";

assert.equal(
  wizards.findById(harry.id)?.attributes?.patronus,
  "Stag"
);

const retrievedWizards = wizards.getAll();

retrievedWizards.length = 0;

assert.equal(wizards.getAll().length, 3);

wizards.add({
  id: 10,
  name: "Luna Lovegood",
  house: "Ravenclaw",
  level: 7,
  active: true
});

const neville = wizards.create({
  name: "Neville Longbottom",
  house: "Gryffindor",
  level: 4,
  active: true
});

assert.equal(neville.id, 11);

const identifiers = wizards.getAll().map(wizard => wizard.id);

assert.equal(new Set(identifiers).size, identifiers.length);

console.log("\n--- Wizard repository ---");
console.log("Identifiers:", identifiers);
console.log(
  "Gryffindor:",
  wizards.findByHouse("Gryffindor").map(wizard => wizard.name)
);
console.log("Harry's level:", wizards.findById(1)?.level);
console.log("All wizard repository checks passed.");

const events: AcademyEvent[] = [
  {
    type: "spell-cast",
    wizardId: harry.id,
    spellName: "Expelliarmus"
  },
  {
    type: "level-up",
    wizardId: hermione.id,
    newLevel: 9
  },
  {
    type: "wizard-expelled",
    wizardId: draco.id
  },
  {
    type: "spell-cast",
    wizardId: hermione.id,
    spellName: "Lumos"
  }
];

const originalEvents = structuredClone(events);
const spellEvents = getSpellEvents(events);
const spellMessages = spellEvents.map(handleSpellCast);

assert.equal(spellEvents.length, 2);

assert.deepEqual(
  spellEvents.map(event => event.type),
  ["spell-cast", "spell-cast"]
);

assert.deepEqual(spellMessages, [
  "Wizard #1 cast Expelliarmus",
  "Wizard #2 cast Lumos"
]);

assert.deepEqual(events, originalEvents);
assert.deepEqual(getSpellEvents([]), []);

assert.deepEqual(
  getSpellEvents([
    {
      type: "level-up",
      wizardId: hermione.id,
      newLevel: 9
    }
  ]),
  []
);

console.log("\n--- Spell events ---");

for (const message of spellMessages) {
  console.log(message);
}

console.log("All spell event checks passed.");