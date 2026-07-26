import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderRepository } from '../../application/ports/out/OrderRepository';
import { Order } from '../../domain/aggregates/Order';
import { OrderEntity } from '../db/entities/OrderEntity';
import { OrderMapper } from '../db/mappers/OrderMapper';
import { OutboxService } from '../outbox/OutboxService';

@Injectable()
export class TypeOrmOrderRepository extends OrderRepository {
  private readonly logger = new Logger(TypeOrmOrderRepository.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    private readonly mapper: OrderMapper,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
    private readonly outboxService: OutboxService,
  ) {
    super();
  }

  async save(order: Order): Promise<void> {
    const entity = this.mapper.toPersistence(order);
    const domainEvents = [...order.domainEvents];

    await this.dataSource.transaction(async (manager) => {
      await manager.save(entity);

      for (const domainEvent of domainEvents) {
        await this.outboxService.write(
          manager,
          'Order',
          order.id.toString(),
          domainEvent,
        );
      }
    });

    for (const domainEvent of domainEvents) {
      this.eventEmitter.emit(domainEvent.eventType, domainEvent);
    }
    order.clearDomainEvents();
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async findByIdempotencyKey(key: string): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({
      where: { idempotencyKey: key },
      relations: { items: true },
    });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }
}
