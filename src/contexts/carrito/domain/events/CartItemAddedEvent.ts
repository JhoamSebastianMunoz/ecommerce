import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class CartItemAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'CartItemAdded' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      productId: this.productId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
