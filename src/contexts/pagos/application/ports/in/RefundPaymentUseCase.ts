import { Payment } from '../../../domain/aggregates/Payment';

export abstract class RefundPaymentUseCase {
  abstract execute(paymentId: string, correlationId?: string): Promise<Payment>;
}
