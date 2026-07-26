import { Payment } from '../../../domain/aggregates/Payment';

export abstract class PaymentEventStore {
  abstract save(payment: Payment): Promise<void>;
  abstract findById(id: string): Promise<Payment | null>;
  abstract findByIdempotencyKey(key: string): Promise<Payment | null>;
}
