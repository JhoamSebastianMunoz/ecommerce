import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class OrderPlacedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly idempotencyKey?: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'OrderPlaced' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      customerId: this.customerId,
      totalAmount: this.totalAmount,
      idempotencyKey: this.idempotencyKey,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
