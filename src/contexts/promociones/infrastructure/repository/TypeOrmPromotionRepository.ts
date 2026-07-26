import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PromotionRepository } from '../../application/ports/out/PromotionRepository';
import { Promotion } from '../../domain/aggregates/Promotion';
import { PromotionEntity } from '../db/entities/PromotionEntity';
import { PromotionMapper } from '../db/mappers/PromotionMapper';

@Injectable()
export class TypeOrmPromotionRepository extends PromotionRepository {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionRepo: Repository<PromotionEntity>,
    private readonly mapper: PromotionMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(promotion: Promotion): Promise<void> {
    const entity = this.mapper.toPersistence(promotion);
    await this.promotionRepo.save(entity);

    for (const event of promotion.domainEvents) {
      this.eventEmitter.emit(event.eventType, event);
    }
    promotion.clearDomainEvents();
  }

  async findById(id: string): Promise<Promotion | null> {
    const entity = await this.promotionRepo.findOne({ where: { id } });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async findByCode(code: string): Promise<Promotion | null> {
    const entity = await this.promotionRepo.findOne({
      where: { code: code.toUpperCase() },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async findAll(): Promise<Promotion[]> {
    const entities = await this.promotionRepo.find();
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.promotionRepo.delete(id);
  }
}
