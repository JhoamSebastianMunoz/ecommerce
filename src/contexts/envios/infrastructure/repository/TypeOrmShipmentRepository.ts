import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ShipmentRepository } from '../../application/ports/out/shipment.repository';
import { Shipment } from '../../domain/aggregates/Shipment';
import { ShipmentEntity } from '../db/entities/ShipmentEntity';
import { ShipmentMapper } from '../db/mappers/ShipmentMapper';

@Injectable()
export class TypeOrmShipmentRepository extends ShipmentRepository {
  constructor(
    @InjectRepository(ShipmentEntity)
    private readonly shipmentRepo: Repository<ShipmentEntity>,
    private readonly mapper: ShipmentMapper,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(shipment: Shipment): Promise<void> {
    const entity = this.mapper.toPersistence(shipment);
    await this.shipmentRepo.save(entity);

    for (const event of shipment.domainEvents) {
      this.eventEmitter.emit(event.eventType, event);
    }
    shipment.clearDomainEvents();
  }

  async findById(id: string): Promise<Shipment | null> {
    const entity = await this.shipmentRepo.findOne({ where: { id } });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async findByOrderId(orderId: string): Promise<Shipment | null> {
    const entity = await this.shipmentRepo.findOne({ where: { orderId } });
    if (!entity) return null;
    return this.mapper.toDomain(entity);
  }

  async findAll(): Promise<Shipment[]> {
    const entities = await this.shipmentRepo.find({ order: { createdAt: 'DESC' } });
    return entities.map((e) => this.mapper.toDomain(e));
  }
}