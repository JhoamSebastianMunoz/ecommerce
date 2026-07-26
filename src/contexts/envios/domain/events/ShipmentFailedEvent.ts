import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ShipmentFailedEvent extends DomainEvent {
  readonly orderId: string;
  readonly trackingNumber: string;
  readonly reason: string;

  constructor(props: {
    eventId?: string;
    aggregateId: string;
    occurredAt?: Date;
    correlationId?: string;
    version?: number;
    orderId: string;
    trackingNumber: string;
    reason: string;
  }) {
    super({
      eventId: props.eventId,
      aggregateId: props.aggregateId,
      occurredAt: props.occurredAt,
      correlationId: props.correlationId,
      eventType: 'ShipmentFailedEvent',
      version: props.version ?? 1,
    });
    this.orderId = props.orderId;
    this.trackingNumber = props.trackingNumber;
    this.reason = props.reason;
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      occurredAt: this.occurredAt,
      correlationId: this.correlationId,
      eventType: this.eventType,
      version: this.version,
      orderId: this.orderId,
      trackingNumber: this.trackingNumber,
      reason: this.reason,
    };
  }
}