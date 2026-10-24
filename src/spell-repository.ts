import { Log, MeasureTime, ValidateSpellPower } from "./decorators";
import { Repository } from "./repository";
import type { Spell } from "./types";

export class SpellRepository {
  private readonly storage = new Repository<Spell>();

  @Log
  @ValidateSpellPower
  add(spell: Spell): void {
    this.storage.add(spell);
  }

  @MeasureTime
  findById(id: number): Spell | undefined {
    return this.storage.findById(id);
  }

  getAll(): Spell[] {
    return this.storage.getAll();
  }
}