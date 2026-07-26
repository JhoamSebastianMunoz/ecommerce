import { Injectable } from '@nestjs/common';
import { Shipment } from '../../../domain/aggregates/Shipment';
import { ShipmentId } from '../../../domain/value-objects/ShipmentId';
import { TrackingNumber } from '../../../domain/value-objects/TrackingNumber';
import { Address } from '../../../domain/value-objects/Address';
import { ShipmentStatus } from '../../../domain/value-objects/ShipmentStatus';
import { ShipmentEntity } from '../entities/ShipmentEntity';

@Injectable()
export class ShipmentMapper {
  toDomain(entity: ShipmentEntity): Shipment {
    return Shipment.reconstitute({
      id: ShipmentId.create(entity.id),
      orderId: entity.orderId,
      trackingNumber: TrackingNumber.create(entity.trackingNumber),
      address: Address.create({
        street: entity.street,
        city: entity.city,
        state: entity.state ?? undefined,
        postalCode: entity.postalCode,
        country: entity.country,
      }),
      status: ShipmentStatus.create(entity.status as any),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      shippedAt: entity.shippedAt ?? undefined,
      deliveredAt: entity.deliveredAt ?? undefined,
    });
  }

  toPersistence(shipment: Shipment): ShipmentEntity {
    const entity = new ShipmentEntity();
    entity.id = shipment.id.toString();
    entity.orderId = shipment.orderId;
    entity.trackingNumber = shipment.trackingNumber.toString();
    entity.street = shipment.address.street;
    entity.city = shipment.address.city;
    entity.state = shipment.address.state ?? null;
    entity.postalCode = shipment.address.postalCode;
    entity.country = shipment.address.country;
    entity.status = shipment.status.toString();
    entity.createdAt = shipment.createdAt;
    entity.updatedAt = shipment.updatedAt;
    entity.shippedAt = shipment.shippedAt ?? null;
    entity.deliveredAt = shipment.deliveredAt ?? null;
    return entity;
  }
}