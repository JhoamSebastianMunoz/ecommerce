import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ProductCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly price: number,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'ProductCreated' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      sku: this.sku,
      name: this.name,
      price: this.price,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
