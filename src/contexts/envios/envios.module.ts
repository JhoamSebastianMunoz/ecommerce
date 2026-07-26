import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentController } from './infrastructure/controller/ShipmentController';
import { TypeOrmShipmentRepository } from './infrastructure/repository/TypeOrmShipmentRepository';
import { ShipmentMapper } from './infrastructure/db/mappers/ShipmentMapper';
import { ShipmentEntity } from './infrastructure/db/entities/ShipmentEntity';
import { ShipmentEventPublisher } from './infrastructure/events/ShipmentEventPublisher';
import { ShipmentPortAdapter } from './infrastructure/adapters/ShipmentPortAdapter';

import { CreateShipmentUseCase } from './application/ports/in/shipment.ports.in';
import { GetShipmentQuery } from './application/ports/in/shipment.ports.in';
import { ListShipmentsQuery } from './application/ports/in/shipment.ports.in';
import { UpdateTrackingStatusUseCase } from './application/ports/in/shipment.ports.in';
import { ShipmentRepository } from './application/ports/out/shipment.repository';

import { CreateShipmentUseCaseImpl } from './application/use-cases/CreateShipmentUseCaseImpl';
import { GetShipmentQueryImpl } from './application/use-cases/GetShipmentQueryImpl';
import { ListShipmentsQueryImpl } from './application/use-cases/ListShipmentsQueryImpl';
import { UpdateTrackingStatusUseCaseImpl } from './application/use-cases/UpdateTrackingStatusUseCaseImpl';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentEntity])],
  controllers: [ShipmentController],
  providers: [
    ShipmentMapper,
    ShipmentEventPublisher,
    ShipmentPortAdapter,
    { provide: ShipmentRepository, useClass: TypeOrmShipmentRepository },
    { provide: CreateShipmentUseCase, useClass: CreateShipmentUseCaseImpl },
    { provide: GetShipmentQuery, useClass: GetShipmentQueryImpl },
    { provide: ListShipmentsQuery, useClass: ListShipmentsQueryImpl },
    { provide: UpdateTrackingStatusUseCase, useClass: UpdateTrackingStatusUseCaseImpl },
  ],
  exports: [
    ShipmentPortAdapter,
    CreateShipmentUseCase,
  ],
})
export class EnviosModule {}