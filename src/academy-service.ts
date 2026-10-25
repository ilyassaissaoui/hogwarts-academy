import type { EntityReader, WizardAccess } from "./repository-contracts";
import type {
  House,
  Spell,
  WizardSummary,
  WizardUpdate
} from "./types";

export class AcademyService {
  constructor(
    private readonly wizards: WizardAccess,
    private readonly spells: EntityReader<Spell>
  ) {}

  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);

    if (wizard === undefined) {
      throw new Error("Wizard not found");
    }

    const spell = this.spells.findById(spellId);

    if (spell === undefined) {
      throw new Error("Spell not found");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  findByHouse(house: House): WizardSummary[] {
    return this.wizards.findByHouse(house).map(wizard => ({
      id: wizard.id,
      name: wizard.name,
      house: wizard.house
    }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }
}