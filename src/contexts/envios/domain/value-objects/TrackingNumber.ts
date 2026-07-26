import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class TrackingNumber extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static create(value: string): TrackingNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('TrackingNumber cannot be empty');
    }
    const trimmed = value.trim().toUpperCase();
    if (!/^[A-Z0-9]{10,30}$/.test(trimmed)) {
      throw new Error('TrackingNumber must be 10-30 alphanumeric characters');
    }
    return new TrackingNumber(trimmed);
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof TrackingNumber && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}