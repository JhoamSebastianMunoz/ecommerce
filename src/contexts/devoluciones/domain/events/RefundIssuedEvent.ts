import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class RefundIssuedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly refundAmount: number,
    public readonly transactionId: string,
    correlationId?: string,
    version?: number,
  ) {
    super({ aggregateId, correlationId, eventType: 'RefundIssued', version });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      orderId: this.orderId,
      refundAmount: this.refundAmount,
      transactionId: this.transactionId,
      version: this.version,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
