export class PaymentResponseDto {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly status: string,
    public readonly amount: number,
    public readonly paymentMethod: string,
    public readonly transactionId: string | null,
    public readonly idempotencyKey: string | null,
    public readonly failureReason: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
