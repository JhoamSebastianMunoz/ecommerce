import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class ReturnId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static fromString(value: string): ReturnId {
    if (!value || typeof value !== 'string') {
      throw new Error('ReturnId must be a non-empty string');
    }
    return new ReturnId(value);
  }

  static generate(): ReturnId {
    const { v4: uuidv4 } = require('uuid');
    return new ReturnId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof ReturnId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
