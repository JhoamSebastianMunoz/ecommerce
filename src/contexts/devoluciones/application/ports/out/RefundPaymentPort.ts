export interface RefundPaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export abstract class RefundPaymentPort {
  abstract refundByOrderId(
    orderId: string,
    amount: number,
    correlationId?: string,
  ): Promise<RefundPaymentResult>;
}
