import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class PromotionId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): PromotionId {
    if (!value || typeof value !== 'string') {
      throw new Error('PromotionId must be a non-empty string');
    }
    return new PromotionId(value);
  }

  static generate(): PromotionId {
    const { v4: uuidv4 } = require('uuid');
    return new PromotionId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof PromotionId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
