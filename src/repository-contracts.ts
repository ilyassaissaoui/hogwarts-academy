import type { House, Wizard, WizardUpdate } from "./types";

export interface EntityReader<Entity> {
  findById(id: number): Entity | undefined;
}

export interface WizardAccess extends EntityReader<Wizard> {
  findByHouse(house: House): Wizard[];
  update(id: number, changes: WizardUpdate): boolean;
}