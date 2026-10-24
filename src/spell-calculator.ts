import { Cache } from "./cache-decorator";

export class SpellCalculator {
  private calculationCount = 0;

  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    this.calculationCount += 1;

    return basePower * multiplier;
  }

  getCalculationCount(): number {
    return this.calculationCount;
  }
}