import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class ReturnReason extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error('ReturnReason must be a non-empty string');
    }
    if (value.length > 500) {
      throw new Error('ReturnReason must not exceed 500 characters');
    }
  }

  static fromString(value: string): ReturnReason {
    return new ReturnReason(value.trim());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof ReturnReason && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
