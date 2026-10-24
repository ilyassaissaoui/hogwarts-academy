import type { AcademyEvent, SpellCastEvent } from "./types";

export function getSpellEvents(
  events: readonly AcademyEvent[]
): SpellCastEvent[] {
  return events.filter(
    (event): event is SpellCastEvent => event.type === "spell-cast"
  );
}

export function handleSpellCast(event: SpellCastEvent): string {
  return `Wizard #${event.wizardId} cast ${event.spellName}`;
}