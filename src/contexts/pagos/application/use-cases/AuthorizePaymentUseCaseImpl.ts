import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorizePaymentUseCase } from '../ports/in/AuthorizePaymentUseCase';
import { PaymentEventStore } from '../ports/out/PaymentEventStore';
import { Payment } from '../../domain/aggregates/Payment';

@Injectable()
export class AuthorizePaymentUseCaseImpl extends AuthorizePaymentUseCase {
  constructor(private readonly eventStore: PaymentEventStore) {
    super();
  }

  async execute(paymentId: string, correlationId?: string): Promise<Payment> {
    const payment = await this.eventStore.findById(paymentId);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${paymentId} not found`);
    }

    payment.authorize(correlationId);
    await this.eventStore.save(payment);
    return payment;
  }
}
