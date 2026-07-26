import { CreateShipmentDto, ShipmentResponseDto, UpdateTrackingStatusDto } from '../../dtos/shipment.dtos';

export abstract class CreateShipmentUseCase {
  abstract execute(dto: CreateShipmentDto, correlationId?: string): Promise<ShipmentResponseDto>;
}

export abstract class GetShipmentQuery {
  abstract execute(id: string): Promise<ShipmentResponseDto | null>;
}

export abstract class UpdateTrackingStatusUseCase {
  abstract execute(id: string, dto: UpdateTrackingStatusDto): Promise<ShipmentResponseDto>;
}

export abstract class ListShipmentsQuery {
  abstract execute(): Promise<ShipmentResponseDto[]>;
}