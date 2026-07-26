import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductQueryPort, ProductInfo } from '../../../carrito/application/ports/out/ProductQueryPort';
import { ProductEntity } from '../db/entities/ProductEntity';

@Injectable()
export class ProductQueryAdapter extends ProductQueryPort {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {
    super();
  }

  async getProductById(productId: string): Promise<ProductInfo | null> {
    const entity = await this.productRepo.findOne({ where: { id: productId } });
    if (!entity) return null;
    return {
      id: entity.id,
      price: Number(entity.price),
      stock: entity.stock,
      name: entity.name,
    };
  }

  async getStock(productId: string): Promise<number> {
    const entity = await this.productRepo.findOne({ where: { id: productId } });
    if (!entity) return 0;
    return entity.stock;
  }
}
