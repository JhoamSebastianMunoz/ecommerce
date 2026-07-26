import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentEventStore } from '../../application/ports/out/PaymentEventStore';
import { Payment } from '../../domain/aggregates/Payment';
import { PaymentEventEntity } from '../db/entities/PaymentEventEntity';
import { PaymentEventMapper } from '../db/mappers/PaymentEventMapper';

@Injectable()
export class TypeOrmPaymentEventStore extends PaymentEventStore {
  constructor(
    @InjectRepository(PaymentEventEntity)
    private readonly eventRepo: Repository<PaymentEventEntity>,
    private readonly mapper: PaymentEventMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(payment: Payment): Promise<void> {
    for (const event of payment.domainEvents) {
      const entity = this.mapper.toEntity(event);
      await this.eventRepo.save(entity);
      this.eventEmitter.emit(event.eventType, event);
    }
    payment.clearDomainEvents();
  }

  async findById(id: string): Promise<Payment | null> {
    const entities = await this.eventRepo.find({
      where: { aggregateId: id },
      order: { version: 'ASC' },
    });
    if (entities.length === 0) return null;
    const events = entities.map((e) => this.mapper.toDomain(e));
    return Payment.fromEvents(events);
  }

  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    const entities = await this.eventRepo
      .createQueryBuilder('pe')
      .where("pe.payload->>'idempotencyKey' = :key", { key })
      .andWhere('pe.event_type = :eventType', { eventType: 'PaymentInitiated' })
      .orderBy('pe.version', 'ASC')
      .getMany();

    if (entities.length === 0) return null;
    const aggregateId = entities[0].aggregateId;

    const allEntities = await this.eventRepo.find({
      where: { aggregateId },
      order: { version: 'ASC' },
    });
    const events = allEntities.map((e) => this.mapper.toDomain(e));
    return Payment.fromEvents(events);
  }
}
