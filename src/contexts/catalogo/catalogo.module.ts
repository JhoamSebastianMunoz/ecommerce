import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './infrastructure/controller/ProductController';
import { TypeOrmProductRepository } from './infrastructure/repository/TypeOrmProductRepository';
import { ProductMapper } from './infrastructure/db/mappers/ProductMapper';
import { ProductEntity } from './infrastructure/db/entities/ProductEntity';
import { CategoryEntity } from './infrastructure/db/entities/CategoryEntity';
import { ProductEventPublisher } from './infrastructure/events/ProductEventPublisher';

import { CreateProductUseCase } from './application/ports/in/CreateProductUseCase';
import { UpdateProductUseCase } from './application/ports/in/UpdateProductUseCase';
import { AdjustStockUseCase } from './application/ports/in/AdjustStockUseCase';
import { DeleteProductUseCase } from './application/ports/in/DeleteProductUseCase';
import { GetProductQuery } from './application/ports/in/GetProductQuery';
import { ListProductsQuery } from './application/ports/in/ListProductsQuery';
import { ProductRepository } from './application/ports/out/ProductRepository';

import { CreateProductUseCaseImpl } from './application/use-cases/CreateProductUseCaseImpl';
import { UpdateProductUseCaseImpl } from './application/use-cases/UpdateProductUseCaseImpl';
import { AdjustStockUseCaseImpl } from './application/use-cases/AdjustStockUseCaseImpl';
import { DeleteProductUseCaseImpl } from './application/use-cases/DeleteProductUseCaseImpl';
import { GetProductQueryImpl } from './application/use-cases/GetProductQueryImpl';
import { ListProductsQueryImpl } from './application/use-cases/ListProductsQueryImpl';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  controllers: [ProductController],
  providers: [
    ProductMapper,
    ProductEventPublisher,
    { provide: ProductRepository, useClass: TypeOrmProductRepository },
    { provide: CreateProductUseCase, useClass: CreateProductUseCaseImpl },
    { provide: UpdateProductUseCase, useClass: UpdateProductUseCaseImpl },
    { provide: AdjustStockUseCase, useClass: AdjustStockUseCaseImpl },
    { provide: DeleteProductUseCase, useClass: DeleteProductUseCaseImpl },
    { provide: GetProductQuery, useClass: GetProductQueryImpl },
    { provide: ListProductsQuery, useClass: ListProductsQueryImpl },
  ],
  exports: [ProductRepository],
})
export class CatalogoModule {}
