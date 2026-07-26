import { Injectable, ConflictException } from '@nestjs/common';
import { CreateShipmentUseCase } from '../ports/in/shipment.ports.in';
import { ShipmentRepository } from '../ports/out/shipment.repository';
import { Shipment } from '../../domain/aggregates/Shipment';
import { ShipmentId } from '../../domain/value-objects/ShipmentId';
import { TrackingNumber } from '../../domain/value-objects/TrackingNumber';
import { Address } from '../../domain/value-objects/Address';
import { CreateShipmentDto, ShipmentResponseDto } from '../dtos/shipment.dtos';

@Injectable()
export class CreateShipmentUseCaseImpl extends CreateShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {
    super();
  }

  async execute(dto: CreateShipmentDto, correlationId?: string): Promise<ShipmentResponseDto> {
    const existing = await this.shipmentRepository.findByOrderId(dto.orderId);
    if (existing) {
      throw new ConflictException(`Shipment for order ${dto.orderId} already exists`);
    }

    const shipment = Shipment.create({
      id: ShipmentId.generate(),
      orderId: dto.orderId,
      trackingNumber: TrackingNumber.create(dto.trackingNumber),
      address: Address.create(dto.address),
      correlationId,
    });

    await this.shipmentRepository.save(shipment);
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