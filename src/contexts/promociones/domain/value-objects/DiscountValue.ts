import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';
import { DiscountType } from './DiscountType';

export class DiscountValue extends ValueObject<number> {
  private constructor(public readonly value: number) {
    super();
  }

  static fromNumber(value: number, discountType: DiscountType): DiscountValue {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('DiscountValue must be a positive finite number');
    }
    if (discountType.isPercentage && value > 100) {
      throw new Error('Percentage discount cannot exceed 100');
    }
    const rounded = Math.round(value * 100) / 100;
    return new DiscountValue(rounded);
  }

  applyDiscount(amount: number, discountType: DiscountType): number {
    if (discountType.isPercentage) {
      return Math.round(amount * (1 - this.value / 100) * 100) / 100;
    }
    const result = amount - this.value;
    return Math.round(Math.max(0, result) * 100) / 100;
  }

  equals(other: ValueObject<number>): boolean {
    return other instanceof DiscountValue && this.value === other.value;
  }

  toString(): string {
    return this.value.toFixed(2);
  }
}
