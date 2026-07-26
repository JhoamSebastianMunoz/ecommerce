import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductUseCase } from '../ports/in/UpdateProductUseCase';
import { ProductRepository } from '../ports/out/ProductRepository';
import { Product } from '../../domain/aggregates/Product';
import { Money } from '../../domain/value-objects/Money';
import { UpdateProductDto } from '../dtos/UpdateProductDto';

@Injectable()
export class UpdateProductUseCaseImpl extends UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    product.updateDetails({
      name: dto.name,
      description: dto.description,
      price: dto.price !== undefined ? Money.fromNumber(dto.price) : undefined,
      lowStockThreshold: dto.lowStockThreshold,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
    });

    await this.productRepository.save(product);
    return product;
  }
}
