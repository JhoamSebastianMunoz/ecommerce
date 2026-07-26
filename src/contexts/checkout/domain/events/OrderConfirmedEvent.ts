import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly paymentTransactionId: string,
    public readonly shipmentId: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'OrderConfirmed' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      paymentTransactionId: this.paymentTransactionId,
      shipmentId: this.shipmentId,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
