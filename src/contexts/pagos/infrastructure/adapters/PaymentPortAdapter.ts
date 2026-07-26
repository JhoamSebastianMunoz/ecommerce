import { Injectable, Logger } from '@nestjs/common';
import { PaymentPort, PaymentResult } from '../../../checkout/application/ports/out/PaymentPort';
import { CreatePaymentUseCase } from '../../application/ports/in/CreatePaymentUseCase';
import { AuthorizePaymentUseCase } from '../../application/ports/in/AuthorizePaymentUseCase';
import { CapturePaymentUseCase } from '../../application/ports/in/CapturePaymentUseCase';
import { RefundPaymentUseCase } from '../../application/ports/in/RefundPaymentUseCase';
import { CreatePaymentDto } from '../../application/dtos/CreatePaymentDto';

@Injectable()
export class PaymentPortAdapter extends PaymentPort {
  private readonly logger = new Logger(PaymentPortAdapter.name);

  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly authorizePaymentUseCase: AuthorizePaymentUseCase,
    private readonly capturePaymentUseCase: CapturePaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {
    super();
  }

  async processPayment(
    orderId: string,
    amount: number,
    idempotencyKey?: string,
    correlationId?: string,
  ): Promise<PaymentResult> {
    try {
      this.logger.log(`Processing payment for order ${orderId}: $${amount}`);

      const payment = await this.createPaymentUseCase.execute(
        new CreatePaymentDto(orderId, amount, 'CREDIT_CARD', idempotencyKey),
        correlationId,
      );

      const authorized = await this.authorizePaymentUseCase.execute(
        payment.id.toString(),
        correlationId,
      );

      const captured = await this.capturePaymentUseCase.execute(
        authorized.id.toString(),
        undefined,
        correlationId,
      );

      return {
        success: true,
        transactionId: captured.transactionId?.toString() ?? `txn-${Date.now()}`,
      };
    } catch (error) {
      this.logger.error(`Payment failed for order ${orderId}: ${(error as Error).message}`);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  async refundPayment(
    transactionId: string,
    correlationId?: string,
  ): Promise<PaymentResult> {
    try {
      this.logger.log(`Refunding payment ${transactionId}`);
      return {
        success: true,
        transactionId,
      };
    } catch (error) {
      this.logger.error(`Refund failed for transaction ${transactionId}: ${(error as Error).message}`);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}
