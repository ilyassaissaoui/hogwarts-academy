import type { Spell } from "./types";

export function Log<Instance, Arguments extends unknown[], Result>(
  target: object,
  methodName: string | symbol,
  descriptor: TypedPropertyDescriptor<
    (this: Instance, ...args: Arguments) => Result
  >
): void {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error("Log must decorate a method");
  }

  descriptor.value = function (
    this: Instance,
    ...args: Arguments
  ): Result {
    console.log(`[CALL] ${String(methodName)}`, args);

    const result = originalMethod.apply(this, args);

    console.log(`[RETURN] ${String(methodName)}`, result);

    return result;
  };
}

export function MeasureTime<Instance, Arguments extends unknown[], Result>(
  target: object,
  methodName: string | symbol,
  descriptor: TypedPropertyDescriptor<
    (this: Instance, ...args: Arguments) => Result
  >
): void {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error("MeasureTime must decorate a method");
  }

  descriptor.value = function (
    this: Instance,
    ...args: Arguments
  ): Result {
    const startTime = performance.now();

    try {
      return originalMethod.apply(this, args);
    } finally {
      const duration = performance.now() - startTime;

      console.log(
        `[TIME] ${String(methodName)}: ${duration.toFixed(2)} ms`
      );
    }
  };
}

export function ValidateSpellPower<Instance>(
  target: object,
  methodName: string | symbol,
  descriptor: TypedPropertyDescriptor<
    (this: Instance, spell: Spell) => void
  >
): void {
  const originalMethod = descriptor.value;

  if (originalMethod === undefined) {
    throw new Error("ValidateSpellPower must decorate a method");
  }

  descriptor.value = function (
    this: Instance,
    spell: Spell
  ): void {
    if (!Number.isFinite(spell.power)) {
      throw new Error("Spell power must be finite");
    }

    if (spell.power < 0) {
      throw new Error("Spell power cannot be negative");
    }

    originalMethod.call(this, spell);
  };
}