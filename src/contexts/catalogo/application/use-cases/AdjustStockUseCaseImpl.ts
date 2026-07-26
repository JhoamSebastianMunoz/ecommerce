import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AdjustStockUseCase } from '../ports/in/AdjustStockUseCase';
import { ProductRepository } from '../ports/out/ProductRepository';
import { Product } from '../../domain/aggregates/Product';
import { AdjustStockDto } from '../dtos/AdjustStockDto';

@Injectable()
export class AdjustStockUseCaseImpl extends AdjustStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(id: string, dto: AdjustStockDto): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    if (!dto.reason?.trim()) {
      throw new BadRequestException('Reason is required for stock adjustment');
    }

    product.adjustStock(dto.quantity, dto.reason.trim());

    await this.productRepository.save(product);
    return product;
  }
}
