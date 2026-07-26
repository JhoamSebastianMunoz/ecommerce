import { Injectable } from '@nestjs/common';
import { ListShipmentsQuery } from '../ports/in/shipment.ports.in';
import { ShipmentRepository } from '../ports/out/shipment.repository';
import { ShipmentResponseDto } from '../dtos/shipment.dtos';
import { Shipment } from '../../domain/aggregates/Shipment';

@Injectable()
export class ListShipmentsQueryImpl extends ListShipmentsQuery {
  constructor(private readonly shipmentRepository: ShipmentRepository) {
    super();
  }

  async execute(): Promise<ShipmentResponseDto[]> {
    const shipments = await this.shipmentRepository.findAll();
    return shipments.map((s) => this.toResponse(s));
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