import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class PaymentInitiatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly paymentMethod: string,
    public readonly idempotencyKey?: string,
    correlationId?: string,
    version?: number,
  ) {
    super({ aggregateId, correlationId, eventType: 'PaymentInitiated', version });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      orderId: this.orderId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      idempotencyKey: this.idempotencyKey,
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
