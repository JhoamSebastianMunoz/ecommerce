import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class Money extends ValueObject<number> {
  private constructor(public readonly amount: number) {
    super();
  }

  static fromNumber(amount: number): Money {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('Money amount must be a non-negative finite number');
    }
    const rounded = Math.round(amount * 100) / 100;
    return new Money(rounded);
  }

  add(other: Money): Money {
    return Money.fromNumber(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Insufficient funds');
    }
    return Money.fromNumber(result);
  }

  multiplyBy(factor: number): Money {
    return Money.fromNumber(this.amount * factor);
  }

  equals(other: ValueObject<number>): boolean {
    return other instanceof Money && this.amount === other.amount;
  }

  toString(): string {
    return this.amount.toFixed(2);
  }
}
