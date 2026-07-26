import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export enum DiscountTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export class DiscountType extends ValueObject<DiscountTypeEnum> {
  private constructor(public readonly value: DiscountTypeEnum) {
    super();
  }

  static percentage(): DiscountType {
    return new DiscountType(DiscountTypeEnum.PERCENTAGE);
  }

  static fixedAmount(): DiscountType {
    return new DiscountType(DiscountTypeEnum.FIXED_AMOUNT);
  }

  static fromString(value: string): DiscountType {
    if (!Object.values(DiscountTypeEnum).includes(value as DiscountTypeEnum)) {
      throw new Error(
        `Invalid DiscountType: ${value}. Must be PERCENTAGE or FIXED_AMOUNT`,
      );
    }
    return new DiscountType(value as DiscountTypeEnum);
  }

  get isPercentage(): boolean {
    return this.value === DiscountTypeEnum.PERCENTAGE;
  }

  get isFixedAmount(): boolean {
    return this.value === DiscountTypeEnum.FIXED_AMOUNT;
  }

  equals(other: ValueObject<DiscountTypeEnum>): boolean {
    return other instanceof DiscountType && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
