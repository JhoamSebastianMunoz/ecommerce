import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class CartId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): CartId {
    if (!value || typeof value !== 'string') {
      throw new Error('CartId must be a non-empty string');
    }
    return new CartId(value);
  }

  static generate(): CartId {
    const { v4: uuidv4 } = require('uuid');
    return new CartId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof CartId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
