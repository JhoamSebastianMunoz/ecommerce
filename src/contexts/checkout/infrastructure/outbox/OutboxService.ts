import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

interface OutboxRow {
  id: string;
  aggregateType: string;
  aggregateId: string;
  type: string;
  payload: Record<string, unknown>;
  correlationId?: string;
  createdAt: Date;
}

@Injectable()
export class OutboxService {
  async write(
    manager: EntityManager,
    aggregateType: string,
    aggregateId: string,
    event: DomainEvent,
  ): Promise<void> {
    const row: OutboxRow = {
      id: event.eventId,
      aggregateType,
      aggregateId,
      type: event.eventType,
      payload: event.toJSON(),
      correlationId: event.correlationId,
      createdAt: new Date(),
    };

    await manager.query(
      `INSERT INTO outbox_messages (id, aggregate_type, aggregate_id, type, payload, correlation_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        row.id,
        row.aggregateType,
        row.aggregateId,
        row.type,
        JSON.stringify(row.payload),
        row.correlationId ?? null,
        row.createdAt,
      ],
    );
  }
}
