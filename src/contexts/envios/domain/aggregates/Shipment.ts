import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { ShipmentId } from '../value-objects/ShipmentId';
import { TrackingNumber } from '../value-objects/TrackingNumber';
import { Address } from '../value-objects/Address';
import { ShipmentStatus, ShipmentStatusEnum } from '../value-objects/ShipmentStatus';
import { ShipmentCreatedEvent } from '../events/ShipmentCreatedEvent';
import { ShipmentInTransitEvent } from '../events/ShipmentInTransitEvent';
import { ShipmentDeliveredEvent } from '../events/ShipmentDeliveredEvent';
import { ShipmentFailedEvent } from '../events/ShipmentFailedEvent';

export interface ShipmentProps {
  id: ShipmentId;
  orderId: string;
  trackingNumber: TrackingNumber;
  address: Address;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export class Shipment extends AggregateRoot<ShipmentProps> {
  private constructor(
    public readonly id: ShipmentId,
    public readonly orderId: string,
    public readonly trackingNumber: TrackingNumber,
    public readonly address: Address,
    private _status: ShipmentStatus,
    private _createdAt: Date,
    private _updatedAt: Date,
    private _shippedAt?: Date,
    private _deliveredAt?: Date,
  ) {
    super();
  }

  get status(): ShipmentStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get shippedAt(): Date | undefined { return this._shippedAt; }
  get deliveredAt(): Date | undefined { return this._deliveredAt; }

  static create(props: {
    id: ShipmentId;
    orderId: string;
    trackingNumber: TrackingNumber;
    address: Address;
    correlationId?: string;
  }): Shipment {
    if (!props.orderId) {
      throw new Error('OrderId is required');
    }
    const now = new Date();
    const shipment = new Shipment(
      props.id,
      props.orderId,
      props.trackingNumber,
      props.address,
      ShipmentStatus.created(),
      now,
      now,
    );
    shipment.addDomainEvent(
      new ShipmentCreatedEvent({
        aggregateId: props.id.toString(),
        orderId: props.orderId,
        trackingNumber: props.trackingNumber.toString(),
        address: {
          street: props.address.street,
          city: props.address.city,
          state: props.address.state,
          postalCode: props.address.postalCode,
          country: props.address.country,
        },
        correlationId: props.correlationId,
      }),
    );
    return shipment;
  }

  static reconstitute(props: ShipmentProps): Shipment {
    return new Shipment(
      props.id,
      props.orderId,
      props.trackingNumber,
      props.address,
      props.status,
      props.createdAt,
      props.updatedAt,
      props.shippedAt,
      props.deliveredAt,
    );
  }

  markInTransit(correlationId?: string): void {
    if (!this._status.canTransitionTo(ShipmentStatusEnum.IN_TRANSIT)) {
      throw new Error(`Cannot transition from ${this._status.value} to IN_TRANSIT`);
    }
    const now = new Date();
    this._status = ShipmentStatus.inTransit();
    this._shippedAt = now;
    this._updatedAt = now;
    this.addDomainEvent(
      new ShipmentInTransitEvent({
        aggregateId: this.id.toString(),
        orderId: this.orderId,
        trackingNumber: this.trackingNumber.toString(),
        correlationId,
      }),
    );
  }

  markDelivered(correlationId?: string): void {
    if (!this._status.canTransitionTo(ShipmentStatusEnum.DELIVERED)) {
      throw new Error(`Cannot transition from ${this._status.value} to DELIVERED`);
    }
    const now = new Date();
    this._status = ShipmentStatus.delivered();
    this._deliveredAt = now;
    this._updatedAt = now;
    this.addDomainEvent(
      new ShipmentDeliveredEvent({
        aggregateId: this.id.toString(),
        orderId: this.orderId,
        trackingNumber: this.trackingNumber.toString(),
        deliveredAt: now,
        correlationId,
      }),
    );
  }

  markFailed(reason: string, correlationId?: string): void {
    if (!this._status.canTransitionTo(ShipmentStatusEnum.FAILED)) {
      throw new Error(`Cannot transition from ${this._status.value} to FAILED`);
    }
    const now = new Date();
    this._status = ShipmentStatus.failed();
    this._updatedAt = now;
    this.addDomainEvent(
      new ShipmentFailedEvent({
        aggregateId: this.id.toString(),
        orderId: this.orderId,
        trackingNumber: this.trackingNumber.toString(),
        reason,
        correlationId,
      }),
    );
  }

  equals(other: AggregateRoot<ShipmentProps>): boolean {
    return other instanceof Shipment && this.id.equals(other.id);
  }
}