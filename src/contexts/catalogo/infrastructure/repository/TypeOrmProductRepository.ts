import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductRepository, FindAllOptions } from '../../application/ports/out/ProductRepository';
import { Product } from '../../domain/aggregates/Product';
import { ProductEntity } from '../db/entities/ProductEntity';
import { CategoryEntity } from '../db/entities/CategoryEntity';
import { ProductMapper } from '../db/mappers/ProductMapper';

@Injectable()
export class TypeOrmProductRepository extends ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
    private readonly mapper: ProductMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(product: Product): Promise<void> {
    const entity = this.mapper.toPersistence(product);
    await this.productRepo.save(entity);

    for (const event of product.domainEvents) {
      this.eventEmitter.emit(event.eventType, event);
    }
    product.clearDomainEvents();
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity, entity.category ?? null);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.productRepo.findOne({
      where: { sku },
      relations: { category: true },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity, entity.category ?? null);
  }

  async findAll(options: FindAllOptions): Promise<{ data: Product[]; total: number }> {
    const query = this.productRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c');

    if (options.categoryId) {
      query.andWhere('p.categoryId = :categoryId', { categoryId: options.categoryId });
    }
    if (options.status) {
      query.andWhere('p.status = :status', { status: options.status });
    }
    if (options.search) {
      query.andWhere(
        '(p.name ILIKE :search OR p.sku ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    query.skip((options.page - 1) * options.limit).take(options.limit);
    query.orderBy('p.createdAt', 'DESC');

    const [entities, total] = await query.getManyAndCount();
    const data = entities.map((e) => this.mapper.toDomain(e, e.category ?? null));

    return { data, total };
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }
}
