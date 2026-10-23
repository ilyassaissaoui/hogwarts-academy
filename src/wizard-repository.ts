import { Repository } from "./repository";
import type { House, NewWizard, Wizard } from "./types";

export class WizardRepository extends Repository<Wizard> {
  create(newWizard: NewWizard): Wizard {
    const wizard: Wizard = {
      ...newWizard,
      id: this.getNextId()
    };

    this.add(wizard);

    return structuredClone(wizard);
  }

  findByHouse(house: House): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }

  private getNextId(): number {
    let highestId = 0;

    for (const wizard of this.getAll()) {
      if (wizard.id > highestId) {
        highestId = wizard.id;
      }
    }

    const nextId = highestId + 1;

    if (!Number.isSafeInteger(nextId)) {
      throw new Error("No safe identifier is available");
    }

    return nextId;
  }
}