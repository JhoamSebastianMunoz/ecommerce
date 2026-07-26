import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export class Address extends ValueObject<Address> {
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
  }): Address {
    if (!props.street?.trim()) {
      throw new Error('Street is required');
    }
    if (!props.city?.trim()) {
      throw new Error('City is required');
    }
    if (!props.postalCode?.trim()) {
      throw new Error('Postal code is required');
    }
    if (!props.country?.trim()) {
      throw new Error('Country is required');
    }
    return new Address(
      props.street.trim(),
      props.city.trim(),
      props.state?.trim(),
      props.postalCode.trim(),
      props.country.trim().toUpperCase(),
    );
  }

  getFullAddress(): string {
    const parts = [this.street, this.city];
    if (this.state) parts.push(this.state);
    parts.push(this.postalCode, this.country);
    return parts.join(', ');
  }

  equals(other: ValueObject<Address>): boolean {
    return (
      other instanceof Address &&
      this.street === other.street &&
      this.city === other.city &&
      this.state === other.state &&
      this.postalCode === other.postalCode &&
      this.country === other.country
    );
  }

  toString(): string {
    return this.getFullAddress();
  }
}