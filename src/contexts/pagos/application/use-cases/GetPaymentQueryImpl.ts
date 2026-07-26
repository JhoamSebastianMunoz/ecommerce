import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPaymentQuery } from '../ports/in/GetPaymentQuery';
import { PaymentEventStore } from '../ports/out/PaymentEventStore';
import { PaymentResponseDto } from '../dtos/PaymentResponseDto';

@Injectable()
export class GetPaymentQueryImpl extends GetPaymentQuery {
  constructor(private readonly eventStore: PaymentEventStore) {
    super();
  }

  async execute(paymentId: string): Promise<PaymentResponseDto> {
    const payment = await this.eventStore.findById(paymentId);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${paymentId} not found`);
    }

    return new PaymentResponseDto(
      payment.id.toString(),
      payment.orderId,
      payment.status?.toString() ?? 'UNKNOWN',
      payment.amount,
      payment.paymentMethod?.toString() ?? 'UNKNOWN',
      payment.transactionId?.toString() ?? null,
      payment.idempotencyKey,
      payment.failureReason,
      payment.createdAt.toISOString(),
      payment.updatedAt.toISOString(),
    );
  }
}
