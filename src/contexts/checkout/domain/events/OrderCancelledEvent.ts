import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly reason?: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'OrderCancelled' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      reason: this.reason,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
