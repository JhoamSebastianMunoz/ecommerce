import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class StockReservedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly items: Array<{ productId: string; quantity: number }>,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'StockReserved' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      items: this.items,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
