import { Injectable, ConflictException } from '@nestjs/common';
import { CreatePaymentUseCase } from '../ports/in/CreatePaymentUseCase';
import { PaymentEventStore } from '../ports/out/PaymentEventStore';
import { Payment } from '../../domain/aggregates/Payment';
import { CreatePaymentDto } from '../dtos/CreatePaymentDto';

@Injectable()
export class CreatePaymentUseCaseImpl extends CreatePaymentUseCase {
  constructor(private readonly eventStore: PaymentEventStore) {
    super();
  }

  async execute(dto: CreatePaymentDto, correlationId?: string): Promise<Payment> {
    if (dto.idempotencyKey) {
      const existing = await this.eventStore.findByIdempotencyKey(dto.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const payment = Payment.create({
      orderId: dto.orderId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      idempotencyKey: dto.idempotencyKey,
      correlationId,
    });

    await this.eventStore.save(payment);
    return payment;
  }
}
