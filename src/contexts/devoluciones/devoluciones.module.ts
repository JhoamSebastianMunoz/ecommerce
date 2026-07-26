import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnController } from './infrastructure/controller/ReturnController';
import { ReturnEventEntity } from './infrastructure/db/entities/ReturnEventEntity';
import { ReturnEventMapper } from './infrastructure/db/mappers/ReturnEventMapper';
import { TypeOrmReturnEventStore } from './infrastructure/repository/TypeOrmReturnEventStore';
import { ReturnEventPublisher } from './infrastructure/events/ReturnEventPublisher';

import { RequestReturnUseCase } from './application/ports/in/return.ports.in';
import { ApproveReturnUseCase } from './application/ports/in/return.ports.in';
import { RejectReturnUseCase } from './application/ports/in/return.ports.in';
import { ReceiveReturnUseCase } from './application/ports/in/return.ports.in';
import { IssueRefundUseCase } from './application/ports/in/return.ports.in';
import { GetReturnQuery } from './application/ports/in/return.ports.in';
import { ReturnEventStore } from './application/ports/out/ReturnEventStore';
import { RefundPaymentPort } from './application/ports/out/RefundPaymentPort';

import { RequestReturnUseCaseImpl } from './application/use-cases/RequestReturnUseCaseImpl';
import { ApproveReturnUseCaseImpl } from './application/use-cases/ApproveReturnUseCaseImpl';
import { RejectReturnUseCaseImpl } from './application/use-cases/RejectReturnUseCaseImpl';
import { ReceiveReturnUseCaseImpl } from './application/use-cases/ReceiveReturnUseCaseImpl';
import { IssueRefundUseCaseImpl } from './application/use-cases/IssueRefundUseCaseImpl';
import { GetReturnQueryImpl } from './application/use-cases/GetReturnQueryImpl';

import { PagosModule } from '../pagos/pagos.module';
import { PaymentEventEntity } from '../pagos/infrastructure/db/entities/PaymentEventEntity';
import { PaymentRefundAdapter } from '../pagos/infrastructure/adapters/PaymentRefundAdapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReturnEventEntity, PaymentEventEntity]),
    PagosModule,
  ],
  controllers: [ReturnController],
  providers: [
    ReturnEventMapper,
    ReturnEventPublisher,
    { provide: ReturnEventStore, useClass: TypeOrmReturnEventStore },
    { provide: RefundPaymentPort, useClass: PaymentRefundAdapter },
    { provide: RequestReturnUseCase, useClass: RequestReturnUseCaseImpl },
    { provide: ApproveReturnUseCase, useClass: ApproveReturnUseCaseImpl },
    { provide: RejectReturnUseCase, useClass: RejectReturnUseCaseImpl },
    { provide: ReceiveReturnUseCase, useClass: ReceiveReturnUseCaseImpl },
    { provide: IssueRefundUseCase, useClass: IssueRefundUseCaseImpl },
    { provide: GetReturnQuery, useClass: GetReturnQueryImpl },
  ],
  exports: [],
})
export class DevolucionesModule {}
