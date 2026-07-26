import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class TransactionId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): TransactionId {
    if (!value || typeof value !== 'string') {
      throw new Error('TransactionId must be a non-empty string');
    }
    return new TransactionId(value);
  }

  static generate(): TransactionId {
    const { v4: uuidv4 } = require('uuid');
    return new TransactionId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof TransactionId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
