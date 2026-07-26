import { Injectable, NotFoundException } from '@nestjs/common';
import { GetShipmentQuery } from '../ports/in/shipment.ports.in';
import { ShipmentRepository } from '../ports/out/shipment.repository';
import { ShipmentResponseDto } from '../dtos/shipment.dtos';
import { Shipment } from '../../domain/aggregates/Shipment';

@Injectable()
export class GetShipmentQueryImpl extends GetShipmentQuery {
  constructor(private readonly shipmentRepository: ShipmentRepository) {
    super();
  }

  async execute(id: string): Promise<ShipmentResponseDto | null> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      return null;
    }
    return this.toResponse(shipment);
  }

  private toResponse(shipment: Shipment): ShipmentResponseDto {
    return {
      id: shipment.id.toString(),
      orderId: shipment.orderId,
      trackingNumber: shipment.trackingNumber.toString(),
      address: {
        street: shipment.address.street,
        city: shipment.address.city,
        state: shipment.address.state,
        postalCode: shipment.address.postalCode,
        country: shipment.address.country,
      },
      status: shipment.status.toString(),
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
      shippedAt: shipment.shippedAt,
      deliveredAt: shipment.deliveredAt,
    };
  }
}