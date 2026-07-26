import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/aggregates/Product';
import { ProductId } from '../../../domain/value-objects/ProductId';
import { SKU } from '../../../domain/value-objects/SKU';
import { Money } from '../../../domain/value-objects/Money';
import { StockQuantity } from '../../../domain/value-objects/StockQuantity';
import { ProductStatus } from '../../../domain/value-objects/ProductStatus';
import { ProductEntity } from '../entities/ProductEntity';
import { CategoryEntity } from '../entities/CategoryEntity';

@Injectable()
export class ProductMapper {
  toDomain(entity: ProductEntity, categoryEntity?: CategoryEntity | null): Product {
    return Product.reconstitute({
      id: ProductId.fromString(entity.id),
      sku: SKU.fromString(entity.sku),
      name: entity.name,
      description: entity.description,
      price: Money.fromNumber(Number(entity.price)),
      stock: StockQuantity.fromNumber(entity.stock),
      lowStockThreshold: entity.lowStockThreshold,
      status: ProductStatus.fromString(entity.status),
      categoryId: entity.categoryId,
      categoryName: categoryEntity?.name ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id.toString();
    entity.sku = product.sku.toString();
    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price.amount;
    entity.stock = product.stock.value;
    entity.lowStockThreshold = product.lowStockThreshold;
    entity.status = product.status.toString();
    entity.categoryId = product.categoryId;
    return entity;
  }
}
