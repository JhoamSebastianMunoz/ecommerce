import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';
import { v4 as uuidv4 } from 'uuid';

export class ShipmentId extends ValueObject<string> {
  private constructor(public readonly value: string) {
    super();
  }

  static create(value: string): ShipmentId {
    if (!value) {
      throw new Error('ShipmentId cannot be empty');
    }
    return new ShipmentId(value);
  }

  static generate(): ShipmentId {
    return new ShipmentId(uuidv4());
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof ShipmentId && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}