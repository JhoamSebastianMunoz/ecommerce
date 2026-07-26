import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ReturnReceivedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly notes: string | null,
    correlationId?: string,
    version?: number,
  ) {
    super({ aggregateId, correlationId, eventType: 'ReturnReceived', version });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      orderId: this.orderId,
      notes: this.notes,
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
