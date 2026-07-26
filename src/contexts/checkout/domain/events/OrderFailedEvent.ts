import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class OrderFailedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly reason: string,
    public readonly failedStep: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'OrderFailed' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      reason: this.reason,
      failedStep: this.failedStep,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
