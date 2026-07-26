import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteProductUseCase } from '../ports/in/DeleteProductUseCase';
import { ProductRepository } from '../ports/out/ProductRepository';

@Injectable()
export class DeleteProductUseCaseImpl extends DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.delete(id);
  }
}
