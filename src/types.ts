export type House =
  | "Gryffindor"
  | "Slytherin"
  | "Ravenclaw"
  | "Hufflepuff";

export interface WizardAttributes {
  [key: string]: string | number | boolean;
}

export interface Wizard {
  readonly id: number;
  name: string;
  house: House;
  level: number;
  active: boolean;
  attributes?: WizardAttributes;
}

export type NewWizard = Omit<Wizard, "id">;

export type WizardSummary = Pick<Wizard, "id" | "name" | "house">;

export type WizardUpdate = Partial<NewWizard>;

export interface SpellDetails {
  readonly id: number;
  name: string;
  power: number;
}

export type Spell = SpellDetails &
  (
    | { category: "attack" }
    | { category: "defense" }
    | { category: "healing" }
  );

export type SpellCategory = Spell["category"];

export type AttackSpell = Extract<Spell, { category: "attack" }>;

export type NonHealingCategory = Exclude<SpellCategory, "healing">;

export type AcademyEvent =
  | {
      type: "spell-cast";
      wizardId: number;
      spellName: string;
    }
  | {
      type: "level-up";
      wizardId: number;
      newLevel: number;
    }
  | {
      type: "wizard-expelled";
      wizardId: number;
    };

export type HousePoints = Record<House, number>;

export type SpellOutput<Category extends SpellCategory> =
  Category extends "attack"
    ? number
    : Category extends "defense"
      ? boolean
      : Category extends "healing"
        ? string
        : never;

export type ArrayElement<Collection> =
  Collection extends (infer Element)[] ? Element : never;