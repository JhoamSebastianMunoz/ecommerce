export class CreatePaymentDto {
  constructor(
    public readonly orderId: string,
    public readonly amount: number,
    public readonly paymentMethod: string,
    public readonly idempotencyKey?: string,
  ) {}
}
