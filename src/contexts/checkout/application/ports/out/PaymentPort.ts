export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export abstract class PaymentPort {
  abstract processPayment(
    orderId: string,
    amount: number,
    idempotencyKey?: string,
    correlationId?: string,
  ): Promise<PaymentResult>;
  abstract refundPayment(
    transactionId: string,
    correlationId?: string,
  ): Promise<PaymentResult>;
}
