import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class ReturnStatus extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
    if (!['REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUND_ISSUED'].includes(value)) {
      throw new Error(`Invalid return status: ${value}`);
    }
  }

  static REQUESTED = new ReturnStatus('REQUESTED');
  static APPROVED = new ReturnStatus('APPROVED');
  static REJECTED = new ReturnStatus('REJECTED');
  static RECEIVED = new ReturnStatus('RECEIVED');
  static REFUND_ISSUED = new ReturnStatus('REFUND_ISSUED');

  static fromString(value: string): ReturnStatus {
    return new ReturnStatus(value.toUpperCase());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof ReturnStatus && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
