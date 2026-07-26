import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class CartItemId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): CartItemId {
    if (!value || typeof value !== 'string') {
      throw new Error('CartItemId must be a non-empty string');
    }
    return new CartItemId(value);
  }

  static generate(): CartItemId {
    const { v4: uuidv4 } = require('uuid');
    return new CartItemId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof CartItemId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
