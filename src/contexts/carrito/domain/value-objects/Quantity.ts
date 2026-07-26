import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class Quantity extends ValueObject<number> {
  private constructor(public readonly value: number) {
    super();
  }

  static fromNumber(value: number): Quantity {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('Quantity must be a positive integer');
    }
    return new Quantity(value);
  }

  increment(amount: number): Quantity {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Increment must be a positive integer');
    }
    return Quantity.fromNumber(this.value + amount);
  }

  decrement(amount: number): Quantity {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Decrement must be a positive integer');
    }
    const result = this.value - amount;
    if (result < 0) {
      throw new Error(`Insufficient quantity: ${this.value} available, ${amount} requested`);
    }
    return Quantity.fromNumber(result);
  }

  update(newValue: number): Quantity {
    return Quantity.fromNumber(newValue);
  }

  equals(other: ValueObject<number>): boolean {
    return other instanceof Quantity && this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
