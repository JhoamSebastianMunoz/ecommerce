import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class CartAbandonedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly customerId: string,
    public readonly itemCount: number,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'CartAbandoned' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      customerId: this.customerId,
      itemCount: this.itemCount,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
