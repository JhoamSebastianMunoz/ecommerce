import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class PromotionCode extends ValueObject<string> {
  private static readonly VALID_PATTERN = /^[A-Z0-9-]{3,50}$/i;

  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): PromotionCode {
    if (!value || typeof value !== 'string') {
      throw new Error('PromotionCode must be a non-empty string');
    }
    const trimmed = value.trim();
    if (!PromotionCode.VALID_PATTERN.test(trimmed)) {
      throw new Error(
        'PromotionCode must be 3-50 characters, alphanumeric or hyphens',
      );
    }
    return new PromotionCode(trimmed.toUpperCase());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof PromotionCode && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
