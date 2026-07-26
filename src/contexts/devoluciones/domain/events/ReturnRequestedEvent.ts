import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ReturnRequestedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly reason: string,
    public readonly items: Array<{ productId: string; quantity: number; unitPrice: number }>,
    correlationId?: string,
    version?: number,
  ) {
    super({ aggregateId, correlationId, eventType: 'ReturnRequested', version });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      orderId: this.orderId,
      reason: this.reason,
      items: this.items,
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
