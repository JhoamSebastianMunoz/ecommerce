export interface OrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddressInput {
  street: string;
  city: string;
}

export class CreateOrderDto {
  constructor(
    public readonly customerId: string,
    public readonly items: OrderItemInput[],
    public readonly shippingAddress: ShippingAddressInput,
    public readonly discountAmount?: number,
    public readonly idempotencyKey?: string,
  ) {}
}
