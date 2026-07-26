import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class StockQuantity extends ValueObject<number> {
  private constructor(public readonly value: number) {
    super();
  }

  static fromNumber(value: number): StockQuantity {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Stock must be a non-negative integer');
    }
    return new StockQuantity(value);
  }

  increment(amount: number): StockQuantity {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Increment must be a positive integer');
    }
    return StockQuantity.fromNumber(this.value + amount);
  }

  decrement(amount: number): StockQuantity {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Decrement must be a positive integer');
    }
    const result = this.value - amount;
    if (result < 0) {
      throw new Error(`Insufficient stock: ${this.value} available, ${amount} requested`);
    }
    return StockQuantity.fromNumber(result);
  }

  isLowStock(threshold: number): boolean {
    return this.value <= threshold;
  }

  equals(other: ValueObject<number>): boolean {
    return other instanceof StockQuantity && this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
