import { Payment } from '../../../domain/aggregates/Payment';

export abstract class CapturePaymentUseCase {
  abstract execute(paymentId: string, transactionId?: string, correlationId?: string): Promise<Payment>;
}
