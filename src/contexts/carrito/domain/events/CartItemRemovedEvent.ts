import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class CartItemRemovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly productId: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'CartItemRemoved' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      productId: this.productId,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
