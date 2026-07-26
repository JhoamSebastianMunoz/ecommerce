import { Injectable } from '@nestjs/common';
import { CreateProductUseCase } from '../ports/in/CreateProductUseCase';
import { ProductRepository } from '../ports/out/ProductRepository';
import { Product } from '../../domain/aggregates/Product';
import { ProductId } from '../../domain/value-objects/ProductId';
import { SKU } from '../../domain/value-objects/SKU';
import { Money } from '../../domain/value-objects/Money';
import { StockQuantity } from '../../domain/value-objects/StockQuantity';
import { CreateProductDto } from '../dtos/CreateProductDto';

@Injectable()
export class CreateProductUseCaseImpl extends CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productRepository.findBySku(dto.sku);
    if (existing) {
      throw new Error(`Product with SKU ${dto.sku} already exists`);
    }

    const product = Product.create({
      id: ProductId.generate(),
      sku: SKU.fromString(dto.sku),
      name: dto.name,
      description: dto.description,
      price: Money.fromNumber(dto.price),
      stock: StockQuantity.fromNumber(dto.stock),
      lowStockThreshold: dto.lowStockThreshold ?? 5,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
    });

    await this.productRepository.save(product);
    return product;
  }
}
