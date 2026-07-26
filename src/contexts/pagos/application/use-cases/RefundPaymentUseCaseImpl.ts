import { Injectable, NotFoundException } from '@nestjs/common';
import { RefundPaymentUseCase } from '../ports/in/RefundPaymentUseCase';
import { PaymentEventStore } from '../ports/out/PaymentEventStore';
import { Payment } from '../../domain/aggregates/Payment';

@Injectable()
export class RefundPaymentUseCaseImpl extends RefundPaymentUseCase {
  constructor(private readonly eventStore: PaymentEventStore) {
    super();
  }

  async execute(paymentId: string, correlationId?: string): Promise<Payment> {
    const payment = await this.eventStore.findById(paymentId);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${paymentId} not found`);
    }

    payment.refund(correlationId);
    await this.eventStore.save(payment);
    return payment;
  }
}
