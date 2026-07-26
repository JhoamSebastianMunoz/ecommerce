import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ReturnApprovedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly refundAmount: number,
    correlationId?: string,
    version?: number,
  ) {
    super({ aggregateId, correlationId, eventType: 'ReturnApproved', version });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      orderId: this.orderId,
      refundAmount: this.refundAmount,
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
