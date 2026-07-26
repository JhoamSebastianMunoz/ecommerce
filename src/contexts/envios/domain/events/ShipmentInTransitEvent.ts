import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class ShipmentInTransitEvent extends DomainEvent {
  readonly orderId: string;
  readonly trackingNumber: string;

  constructor(props: {
    eventId?: string;
    aggregateId: string;
    occurredAt?: Date;
    correlationId?: string;
    version?: number;
    orderId: string;
    trackingNumber: string;
  }) {
    super({
      eventId: props.eventId,
      aggregateId: props.aggregateId,
      occurredAt: props.occurredAt,
      correlationId: props.correlationId,
      eventType: 'ShipmentInTransitEvent',
      version: props.version ?? 1,
    });
    this.orderId = props.orderId;
    this.trackingNumber = props.trackingNumber;
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
    };
  }
}