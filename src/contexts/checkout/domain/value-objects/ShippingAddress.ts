import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class ShippingAddress extends ValueObject<ShippingAddress> {
  private constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string | undefined,
    public readonly postalCode: string,
    public readonly country: string,
  ) {
    super();
  }

  static create(props: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  }): ShippingAddress {
    if (!props.street?.trim()) {
      throw new Error('Street must be a non-empty string');
    }
    if (!props.city?.trim()) {
      throw new Error('City must be a non-empty string');
    }
    if (!props.postalCode?.trim()) {
      throw new Error('Postal code must be a non-empty string');
    }
    if (!props.country?.trim()) {
      throw new Error('Country must be a non-empty string');
    }
    const country = props.country.trim().toUpperCase();
    if (country.length !== 2) {
      throw new Error('Country must be a 2-letter ISO code');
    }
    return new ShippingAddress(
      props.street.trim(),
      props.city.trim(),
      props.state?.trim(),
      props.postalCode.trim(),
      country,
    );
  }

  equals(other: ValueObject<ShippingAddress>): boolean {
    return (
      other instanceof ShippingAddress &&
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }

  toString(): string {
    const parts = [this.street, this.city];
    if (this.state) parts.push(this.state);
    parts.push(this.postalCode, this.country);
    return parts.join(', ');
  }
}
