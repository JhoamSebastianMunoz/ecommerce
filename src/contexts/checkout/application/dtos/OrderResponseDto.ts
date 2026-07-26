export class OrderResponseDto {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly status: string,
    public readonly items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>,
    public readonly totalAmount: number,
    public readonly discountAmount: number,
    public readonly shippingAddress: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly idempotencyKey?: string,
  ) {}
}
