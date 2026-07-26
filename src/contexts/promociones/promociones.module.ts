import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionController } from './infrastructure/controller/PromotionController';
import { TypeOrmPromotionRepository } from './infrastructure/repository/TypeOrmPromotionRepository';
import { PromotionMapper } from './infrastructure/db/mappers/PromotionMapper';
import { PromotionEntity } from './infrastructure/db/entities/PromotionEntity';
import { PromotionEventPublisher } from './infrastructure/events/PromotionEventPublisher';

import { CreatePromotionUseCase } from './application/ports/in/CreatePromotionUseCase';
import { ValidatePromotionUseCase } from './application/ports/in/ValidatePromotionUseCase';
import { ApplyPromotionUseCase } from './application/ports/in/ApplyPromotionUseCase';
import { DeactivatePromotionUseCase } from './application/ports/in/DeactivatePromotionUseCase';
import { PromotionRepository } from './application/ports/out/PromotionRepository';

import { CreatePromotionUseCaseImpl } from './application/use-cases/CreatePromotionUseCaseImpl';
import { ValidatePromotionUseCaseImpl } from './application/use-cases/ValidatePromotionUseCaseImpl';
import { ApplyPromotionUseCaseImpl } from './application/use-cases/ApplyPromotionUseCaseImpl';
import { DeactivatePromotionUseCaseImpl } from './application/use-cases/DeactivatePromotionUseCaseImpl';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionEntity])],
  controllers: [PromotionController],
  providers: [
    PromotionMapper,
    PromotionEventPublisher,
    { provide: PromotionRepository, useClass: TypeOrmPromotionRepository },
    { provide: CreatePromotionUseCase, useClass: CreatePromotionUseCaseImpl },
    {
      provide: ValidatePromotionUseCase,
      useClass: ValidatePromotionUseCaseImpl,
    },
    { provide: ApplyPromotionUseCase, useClass: ApplyPromotionUseCaseImpl },
    {
      provide: DeactivatePromotionUseCase,
      useClass: DeactivatePromotionUseCaseImpl,
    },
  ],
  exports: [PromotionRepository],
})
export class PromocionesModule {}
