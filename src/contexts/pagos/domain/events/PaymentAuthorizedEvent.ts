import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class PaymentAuthorizedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    correlationId?: string,
    version?: number,
  ) {
    super({ aggregateId, correlationId, eventType: 'PaymentAuthorized', version });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      orderId: this.orderId,
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
