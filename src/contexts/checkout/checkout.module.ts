import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './infrastructure/controller/CheckoutController';
import { TypeOrmOrderRepository } from './infrastructure/repository/TypeOrmOrderRepository';
import { OrderMapper } from './infrastructure/db/mappers/OrderMapper';
import { OrderEntity } from './infrastructure/db/entities/OrderEntity';
import { OrderItemEntity } from './infrastructure/db/entities/OrderItemEntity';
import { CheckoutEventPublisher } from './infrastructure/events/CheckoutEventPublisher';
import { OutboxService } from './infrastructure/outbox/OutboxService';
import { PaymentPortStub } from './infrastructure/repository/PaymentPortStub';
import { ShipmentPortStub } from './infrastructure/repository/ShipmentPortStub';

import { CreateOrderUseCase } from './application/ports/in/CreateOrderUseCase';
import { GetOrderQuery } from './application/ports/in/GetOrderQuery';
import { OrderRepository } from './application/ports/out/OrderRepository';
import { ProductStockPort } from './application/ports/out/ProductStockPort';
import { PaymentPort } from './application/ports/out/PaymentPort';
import { ShipmentPort } from './application/ports/out/ShipmentPort';

import { CreateOrderUseCaseImpl } from './application/use-cases/CreateOrderUseCaseImpl';
import { GetOrderQueryImpl } from './application/use-cases/GetOrderQueryImpl';
import { CheckoutSaga } from './application/saga/CheckoutSaga';

import { ProductStockAdapter } from '../catalogo/infrastructure/adapters/ProductStockAdapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
  ],
  controllers: [CheckoutController],
  providers: [
    OrderMapper,
    CheckoutEventPublisher,
    OutboxService,
    CheckoutSaga,
    { provide: OrderRepository, useClass: TypeOrmOrderRepository },
    { provide: ProductStockPort, useClass: ProductStockAdapter },
    { provide: PaymentPort, useClass: PaymentPortStub },
    { provide: ShipmentPort, useClass: ShipmentPortStub },
    { provide: CreateOrderUseCase, useClass: CreateOrderUseCaseImpl },
    { provide: GetOrderQuery, useClass: GetOrderQueryImpl },
  ],
  exports: [OrderRepository],
})
export class CheckoutModule {}
