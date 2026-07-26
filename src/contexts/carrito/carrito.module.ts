import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './infrastructure/controller/CartController';
import { TypeOrmCartRepository } from './infrastructure/repository/TypeOrmCartRepository';
import { CartMapper } from './infrastructure/db/mappers/CartMapper';
import { CartEntity } from './infrastructure/db/entities/CartEntity';
import { CartItemEntity } from './infrastructure/db/entities/CartItemEntity';
import { CartEventPublisher } from './infrastructure/events/CartEventPublisher';

import { CreateCartUseCase } from './application/ports/in/CreateCartUseCase';
import { AddItemToCartUseCase } from './application/ports/in/AddItemToCartUseCase';
import { UpdateCartItemQuantityUseCase } from './application/ports/in/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from './application/ports/in/RemoveItemFromCartUseCase';
import { GetCartQuery } from './application/ports/in/GetCartQuery';
import { ClearCartUseCase } from './application/ports/in/ClearCartUseCase';
import { CartRepository } from './application/ports/out/CartRepository';
import { ProductQueryPort } from './application/ports/out/ProductQueryPort';

import { CreateCartUseCaseImpl } from './application/use-cases/CreateCartUseCaseImpl';
import { AddItemToCartUseCaseImpl } from './application/use-cases/AddItemToCartUseCaseImpl';
import { UpdateCartItemQuantityUseCaseImpl } from './application/use-cases/UpdateCartItemQuantityUseCaseImpl';
import { RemoveItemFromCartUseCaseImpl } from './application/use-cases/RemoveItemFromCartUseCaseImpl';
import { GetCartQueryImpl } from './application/use-cases/GetCartQueryImpl';
import { ClearCartUseCaseImpl } from './application/use-cases/ClearCartUseCaseImpl';

import { ProductEntity } from '../catalogo/infrastructure/db/entities/ProductEntity';
import { ProductQueryAdapter } from '../catalogo/infrastructure/adapters/ProductQueryAdapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity, ProductEntity]),
  ],
  controllers: [CartController],
  providers: [
    CartMapper,
    CartEventPublisher,
    { provide: CartRepository, useClass: TypeOrmCartRepository },
    { provide: ProductQueryPort, useClass: ProductQueryAdapter },
    { provide: CreateCartUseCase, useClass: CreateCartUseCaseImpl },
    { provide: AddItemToCartUseCase, useClass: AddItemToCartUseCaseImpl },
    { provide: UpdateCartItemQuantityUseCase, useClass: UpdateCartItemQuantityUseCaseImpl },
    { provide: RemoveItemFromCartUseCase, useClass: RemoveItemFromCartUseCaseImpl },
    { provide: GetCartQuery, useClass: GetCartQueryImpl },
    { provide: ClearCartUseCase, useClass: ClearCartUseCaseImpl },
  ],
  exports: [CartRepository],
})
export class CarritoModule {}
