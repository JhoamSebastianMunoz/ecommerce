import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class ProductId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): ProductId {
    if (!value || typeof value !== 'string') {
      throw new Error('ProductId must be a non-empty string');
    }
    return new ProductId(value);
  }

  static generate(): ProductId {
    const { v4: uuidv4 } = require('uuid');
    return new ProductId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof ProductId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
