import type {
  House,
  Spell,
  SpellCategory,
  Wizard,
  WizardAttributes
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function isPositiveIdentifier(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isHouse(value: unknown): value is House {
  return (
    value === "Gryffindor" ||
    value === "Slytherin" ||
    value === "Ravenclaw" ||
    value === "Hufflepuff"
  );
}

function isWizardAttributes(value: unknown): value is WizardAttributes {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(attribute =>
    typeof attribute === "string" ||
    typeof attribute === "boolean" ||
    (typeof attribute === "number" && Number.isFinite(attribute))
  );
}

export function isWizard(value: unknown): value is Wizard {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isPositiveIdentifier(value.id) &&
    isNonEmptyString(value.name) &&
    isHouse(value.house) &&
    typeof value.level === "number" &&
    Number.isSafeInteger(value.level) &&
    value.level >= 0 &&
    typeof value.active === "boolean" &&
    (
      value.attributes === undefined ||
      isWizardAttributes(value.attributes)
    )
  );
}

function isSpellCategory(value: unknown): value is SpellCategory {
  return (
    value === "attack" ||
    value === "defense" ||
    value === "healing"
  );
}

export function isSpell(value: unknown): value is Spell {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isPositiveIdentifier(value.id) &&
    isNonEmptyString(value.name) &&
    isSpellCategory(value.category) &&
    typeof value.power === "number" &&
    Number.isFinite(value.power) &&
    value.power >= 0
  );
}