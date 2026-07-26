import { Payment } from '../../../domain/aggregates/Payment';

export abstract class AuthorizePaymentUseCase {
  abstract execute(paymentId: string, correlationId?: string): Promise<Payment>;
}
