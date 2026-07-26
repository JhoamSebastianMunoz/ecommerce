import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class OrderId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): OrderId {
    if (!value || typeof value !== 'string') {
      throw new Error('OrderId must be a non-empty string');
    }
    return new OrderId(value);
  }

  static generate(): OrderId {
    const { v4: uuidv4 } = require('uuid');
    return new OrderId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof OrderId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
