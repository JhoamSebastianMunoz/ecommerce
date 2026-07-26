import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductQuery } from '../ports/in/GetProductQuery';
import { ProductRepository } from '../ports/out/ProductRepository';
import { Product } from '../../domain/aggregates/Product';

@Injectable()
export class GetProductQueryImpl extends GetProductQuery {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(id: string): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
}
