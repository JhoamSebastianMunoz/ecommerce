import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class SKU extends ValueObject<string> {
  private static readonly SKU_REGEX = /^[A-Z0-9-]{3,50}$/i;

  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): SKU {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error('SKU must not be empty');
    }
    if (!SKU.SKU_REGEX.test(trimmed)) {
      throw new Error('SKU must be alphanumeric (3-50 characters)');
    }
    return new SKU(trimmed.toUpperCase());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof SKU && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
