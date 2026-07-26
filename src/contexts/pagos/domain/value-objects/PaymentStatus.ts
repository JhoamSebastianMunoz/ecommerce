import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class PaymentStatus extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
    if (!['INITIATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'].includes(value)) {
      throw new Error(`Invalid payment status: ${value}`);
    }
  }

  static INITIATED = new PaymentStatus('INITIATED');
  static AUTHORIZED = new PaymentStatus('AUTHORIZED');
  static CAPTURED = new PaymentStatus('CAPTURED');
  static FAILED = new PaymentStatus('FAILED');
  static REFUNDED = new PaymentStatus('REFUNDED');

  static fromString(value: string): PaymentStatus {
    return new PaymentStatus(value.toUpperCase());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof PaymentStatus && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
