import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundPaymentPort, RefundPaymentResult } from '../../../devoluciones/application/ports/out/RefundPaymentPort';
import { RefundPaymentUseCase } from '../../application/ports/in/RefundPaymentUseCase';
import { PaymentEventEntity } from '../db/entities/PaymentEventEntity';

@Injectable()
export class PaymentRefundAdapter extends RefundPaymentPort {
  private readonly logger = new Logger(PaymentRefundAdapter.name);

  constructor(
    @InjectRepository(PaymentEventEntity)
    private readonly eventRepo: Repository<PaymentEventEntity>,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {
    super();
  }

  async refundByOrderId(
    orderId: string,
    amount: number,
    correlationId?: string,
  ): Promise<RefundPaymentResult> {
    try {
      this.logger.log(`Looking up payment for order ${orderId} to refund $${amount}`);

      const initiatedEvent = await this.eventRepo
        .createQueryBuilder('pe')
        .where("pe.payload->>'orderId' = :orderId", { orderId })
        .andWhere('pe.event_type = :eventType', { eventType: 'PaymentInitiated' })
        .orderBy('pe.version', 'ASC')
        .getOne();

      if (!initiatedEvent) {
        return {
          success: false,
          error: `No payment found for order ${orderId}`,
        };
      }

      const paymentId = initiatedEvent.aggregateId;
      const payment = await this.refundPaymentUseCase.execute(paymentId, correlationId);

      return {
        success: true,
        transactionId: payment.transactionId?.toString() ?? `refund-${Date.now()}`,
      };
    } catch (error) {
      this.logger.error(`Refund failed for order ${orderId}: ${(error as Error).message}`);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}
