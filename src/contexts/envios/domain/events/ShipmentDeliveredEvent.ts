import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ShipmentDeliveredEvent extends DomainEvent {
  readonly orderId: string;
  readonly trackingNumber: string;
  readonly deliveredAt: Date;

  constructor(props: {
    eventId?: string;
    aggregateId: string;
    occurredAt?: Date;
    correlationId?: string;
    version?: number;
    orderId: string;
    trackingNumber: string;
    deliveredAt: Date;
  }) {
    super({
      eventId: props.eventId,
      aggregateId: props.aggregateId,
      occurredAt: props.occurredAt,
      correlationId: props.correlationId,
      eventType: 'ShipmentDeliveredEvent',
      version: props.version ?? 1,
    });
    this.orderId = props.orderId;
    this.trackingNumber = props.trackingNumber;
    this.deliveredAt = props.deliveredAt;
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
      deliveredAt: this.deliveredAt,
    };
  }
}