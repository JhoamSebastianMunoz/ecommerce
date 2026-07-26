import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class PaymentMethod extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
    if (!['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'TRANSFER'].includes(value)) {
      throw new Error(`Invalid payment method: ${value}`);
    }
  }

  static CREDIT_CARD = new PaymentMethod('CREDIT_CARD');
  static DEBIT_CARD = new PaymentMethod('DEBIT_CARD');
  static PAYPAL = new PaymentMethod('PAYPAL');
  static TRANSFER = new PaymentMethod('TRANSFER');

  static fromString(value: string): PaymentMethod {
    return new PaymentMethod(value.toUpperCase());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof PaymentMethod && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
