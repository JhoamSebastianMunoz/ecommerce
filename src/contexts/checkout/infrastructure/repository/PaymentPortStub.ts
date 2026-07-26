import { Injectable, Logger } from '@nestjs/common';
import { PaymentPort, PaymentResult } from '../../application/ports/out/PaymentPort';

@Injectable()
export class PaymentPortStub extends PaymentPort {
  private readonly logger = new Logger(PaymentPortStub.name);

  async processPayment(
    orderId: string,
    amount: number,
    idempotencyKey?: string,
    correlationId?: string,
  ): Promise<PaymentResult> {
    this.logger.log(
      `[STUB] Processing payment for order ${orderId}: $${amount} (idempotencyKey: ${idempotencyKey})`,
    );
    return {
      success: true,
      transactionId: `txn-stub-${Date.now()}`,
    };
  }

  async refundPayment(
    transactionId: string,
    correlationId?: string,
  ): Promise<PaymentResult> {
    this.logger.log(`[STUB] Refunding payment ${transactionId}`);
    return { success: true, transactionId };
  }
}
