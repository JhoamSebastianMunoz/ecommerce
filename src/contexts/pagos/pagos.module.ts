import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './infrastructure/controller/PaymentController';
import { PaymentEventEntity } from './infrastructure/db/entities/PaymentEventEntity';
import { PaymentEventMapper } from './infrastructure/db/mappers/PaymentEventMapper';
import { TypeOrmPaymentEventStore } from './infrastructure/repository/TypeOrmPaymentEventStore';
import { PaymentEventPublisher } from './infrastructure/events/PaymentEventPublisher';
import { PaymentPortAdapter } from './infrastructure/adapters/PaymentPortAdapter';

import { CreatePaymentUseCase } from './application/ports/in/CreatePaymentUseCase';
import { AuthorizePaymentUseCase } from './application/ports/in/AuthorizePaymentUseCase';
import { CapturePaymentUseCase } from './application/ports/in/CapturePaymentUseCase';
import { RefundPaymentUseCase } from './application/ports/in/RefundPaymentUseCase';
import { GetPaymentQuery } from './application/ports/in/GetPaymentQuery';
import { PaymentEventStore } from './application/ports/out/PaymentEventStore';

import { CreatePaymentUseCaseImpl } from './application/use-cases/CreatePaymentUseCaseImpl';
import { AuthorizePaymentUseCaseImpl } from './application/use-cases/AuthorizePaymentUseCaseImpl';
import { CapturePaymentUseCaseImpl } from './application/use-cases/CapturePaymentUseCaseImpl';
import { RefundPaymentUseCaseImpl } from './application/use-cases/RefundPaymentUseCaseImpl';
import { GetPaymentQueryImpl } from './application/use-cases/GetPaymentQueryImpl';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEventEntity])],
  controllers: [PaymentController],
  providers: [
    PaymentEventMapper,
    PaymentEventPublisher,
    PaymentPortAdapter,
    { provide: PaymentEventStore, useClass: TypeOrmPaymentEventStore },
    { provide: CreatePaymentUseCase, useClass: CreatePaymentUseCaseImpl },
    { provide: AuthorizePaymentUseCase, useClass: AuthorizePaymentUseCaseImpl },
    { provide: CapturePaymentUseCase, useClass: CapturePaymentUseCaseImpl },
    { provide: RefundPaymentUseCase, useClass: RefundPaymentUseCaseImpl },
    { provide: GetPaymentQuery, useClass: GetPaymentQueryImpl },
  ],
  exports: [
    PaymentPortAdapter,
    CreatePaymentUseCase,
    AuthorizePaymentUseCase,
    CapturePaymentUseCase,
    RefundPaymentUseCase,
  ],
})
export class PagosModule {}
