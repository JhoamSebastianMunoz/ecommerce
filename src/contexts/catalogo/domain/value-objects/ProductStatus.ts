export enum ProductStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export class ProductStatus {
  private constructor(public readonly value: ProductStatusEnum) {}

  static ACTIVE = new ProductStatus(ProductStatusEnum.ACTIVE);
  static INACTIVE = new ProductStatus(ProductStatusEnum.INACTIVE);
  static DISCONTINUED = new ProductStatus(ProductStatusEnum.DISCONTINUED);

  static fromString(value: string): ProductStatus {
    switch (value?.toUpperCase()) {
      case 'ACTIVE':
        return ProductStatus.ACTIVE;
      case 'INACTIVE':
        return ProductStatus.INACTIVE;
      case 'DISCONTINUED':
        return ProductStatus.DISCONTINUED;
      default:
        throw new Error(`Invalid product status: ${value}`);
    }
  }

  equals(other: ProductStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
