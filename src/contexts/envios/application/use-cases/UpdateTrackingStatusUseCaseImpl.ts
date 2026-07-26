import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateTrackingStatusUseCase } from '../ports/in/shipment.ports.in';
import { ShipmentRepository } from '../ports/out/shipment.repository';
import { Shipment } from '../../domain/aggregates/Shipment';
import { ShipmentStatusEnum } from '../../domain/value-objects/ShipmentStatus';
import { ShipmentResponseDto, UpdateTrackingStatusDto } from '../dtos/shipment.dtos';

@Injectable()
export class UpdateTrackingStatusUseCaseImpl extends UpdateTrackingStatusUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepository) {
    super();
  }

  async execute(id: string, dto: UpdateTrackingStatusDto): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }

    switch (dto.status) {
      case 'IN_TRANSIT':
        shipment.markInTransit();
        break;
      case 'DELIVERED':
        shipment.markDelivered();
        break;
      case 'FAILED':
        shipment.markFailed(dto.reason ?? 'Unknown error');
        break;
      default:
        throw new BadRequestException(`Invalid status: ${dto.status}`);
    }

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