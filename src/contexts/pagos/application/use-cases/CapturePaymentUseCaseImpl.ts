import { Injectable, NotFoundException } from '@nestjs/common';
import { CapturePaymentUseCase } from '../ports/in/CapturePaymentUseCase';
import { PaymentEventStore } from '../ports/out/PaymentEventStore';
import { Payment } from '../../domain/aggregates/Payment';

@Injectable()
export class CapturePaymentUseCaseImpl extends CapturePaymentUseCase {
  constructor(private readonly eventStore: PaymentEventStore) {
    super();
  }

  async execute(paymentId: string, transactionId?: string, correlationId?: string): Promise<Payment> {
    const payment = await this.eventStore.findById(paymentId);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${paymentId} not found`);
    }

    const txnId = transactionId ?? `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    payment.capture(txnId, correlationId);
    await this.eventStore.save(payment);
    return payment;
  }
}
