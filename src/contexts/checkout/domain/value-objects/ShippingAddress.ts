import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class ShippingAddress extends ValueObject<string> {
  private constructor(
    public readonly street: string,
    public readonly city: string,
  ) {
    super();
  }

  static create(street: string, city: string): ShippingAddress {
    if (!street || street.trim().length === 0) {
      throw new Error('Street must be a non-empty string');
    }
    if (!city || city.trim().length === 0) {
      throw new Error('City must be a non-empty string');
    }
    return new ShippingAddress(street.trim(), city.trim());
  }

  equals(other: ValueObject<string>): boolean {
    return (
      other instanceof ShippingAddress &&
      this.street === other.street &&
      this.city === other.city
    );
  }

  toString(): string {
    return `${this.street}, ${this.city}`;
  }
}
