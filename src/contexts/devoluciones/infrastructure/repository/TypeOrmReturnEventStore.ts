import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReturnEventStore } from '../../application/ports/out/ReturnEventStore';
import { Return } from '../../domain/aggregates/Return';
import { ReturnEventEntity } from '../db/entities/ReturnEventEntity';
import { ReturnEventMapper } from '../db/mappers/ReturnEventMapper';

@Injectable()
export class TypeOrmReturnEventStore extends ReturnEventStore {
  constructor(
    @InjectRepository(ReturnEventEntity)
    private readonly eventRepo: Repository<ReturnEventEntity>,
    private readonly mapper: ReturnEventMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(ret: Return): Promise<void> {
    for (const event of ret.domainEvents) {
      const entity = this.mapper.toEntity(event);
      await this.eventRepo.save(entity);
      this.eventEmitter.emit(event.eventType, event);
    }
    ret.clearDomainEvents();
  }

  async findById(id: string): Promise<Return | null> {
    const entities = await this.eventRepo.find({
      where: { aggregateId: id },
      order: { version: 'ASC' },
    });
    if (entities.length === 0) return null;
    const events = entities.map((e) => this.mapper.toDomain(e));
    return Return.fromEvents(events);
  }
}
