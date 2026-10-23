import type {
  ArrayElement,
  AttackSpell,
  HousePoints,
  NewWizard,
  NonHealingCategory,
  Spell,
  SpellOutput,
  Wizard,
  WizardSummary,
  WizardUpdate
} from "./types";

const newWizard: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  attributes: {
    patronus: "Stag",
    quidditchPlayer: true
  }
};

const wizard: Wizard = {
  ...newWizard,
  id: 1
};

const wizardSummary: WizardSummary = {
  id: wizard.id,
  name: wizard.name,
  house: wizard.house
};

const wizardUpdate: WizardUpdate = {
  level: 6
};

const attackSpell: AttackSpell = {
  id: 101,
  name: "Expelliarmus",
  category: "attack",
  power: 80
};

const spellCollection: Spell[] = [attackSpell];

const firstSpell: ArrayElement<typeof spellCollection> = attackSpell;

const housePoints: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};

const attackOutput: SpellOutput<"attack"> = attackSpell.power;
const defenseOutput: SpellOutput<"defense"> = true;
const healingOutput: SpellOutput<"healing"> = "Health restored";

const nonHealingCategory: NonHealingCategory = "defense";

console.log("Hogwarts Academy");
console.log("Wizard:", wizardSummary);
console.log("Wizard attributes:", wizard.attributes);
console.log("Proposed update:", wizardUpdate);
console.log("Spell:", firstSpell);
console.log("House points:", housePoints);
console.log("Attack output:", attackOutput);
console.log("Defense output:", defenseOutput);
console.log("Healing output:", healingOutput);
console.log("Non-healing category:", nonHealingCategory);