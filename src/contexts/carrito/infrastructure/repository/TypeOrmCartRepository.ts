import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CartRepository } from '../../application/ports/out/CartRepository';
import { Cart } from '../../domain/aggregates/Cart';
import { CartEntity } from '../db/entities/CartEntity';
import { CartMapper } from '../db/mappers/CartMapper';

@Injectable()
export class TypeOrmCartRepository extends CartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    private readonly mapper: CartMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(cart: Cart): Promise<void> {
    const entity = this.mapper.toPersistence(cart);
    await this.cartRepo.save(entity);

    for (const event of cart.domainEvents) {
      this.eventEmitter.emit(event.eventType, event);
    }
    cart.clearDomainEvents();
  }

  async findById(id: string): Promise<Cart | null> {
    const entity = await this.cartRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async findByCustomerId(customerId: string): Promise<Cart | null> {
    const entity = await this.cartRepo.findOne({
      where: { customerId },
      relations: { items: true },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.cartRepo.delete(id);
  }
}
