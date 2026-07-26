import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class CustomerId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): CustomerId {
    const trimmed = value?.trim();
    if (!trimmed) {
      throw new Error('CustomerId must not be empty');
    }
    return new CustomerId(trimmed);
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof CustomerId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
