import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../../../../shared-kernel/domain/base/DomainEvent';
import { ReturnRequestedEvent } from '../../../domain/events/ReturnRequestedEvent';
import { ReturnApprovedEvent } from '../../../domain/events/ReturnApprovedEvent';
import { ReturnRejectedEvent } from '../../../domain/events/ReturnRejectedEvent';
import { ReturnReceivedEvent } from '../../../domain/events/ReturnReceivedEvent';
import { RefundIssuedEvent } from '../../../domain/events/RefundIssuedEvent';
import { ReturnEventEntity } from '../entities/ReturnEventEntity';

@Injectable()
export class ReturnEventMapper {
  toEntity(event: DomainEvent): ReturnEventEntity {
    const entity = new ReturnEventEntity();
    entity.aggregateId = event.aggregateId;
    entity.eventType = event.eventType;
    entity.version = event.version;
    entity.payload = event.toJSON() as Record<string, unknown>;
    entity.metadata = {
      eventId: event.eventId,
      correlationId: event.correlationId,
      occurredAt: event.occurredAt.toISOString(),
    };
    return entity;
  }

  toDomain(entity: ReturnEventEntity): DomainEvent {
    const payload = entity.payload;
    switch (entity.eventType) {
      case 'ReturnRequested':
        return new ReturnRequestedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.reason as string,
          payload.items as Array<{ productId: string; quantity: number; unitPrice: number }>,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'ReturnApproved':
        return new ReturnApprovedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.refundAmount as number,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'ReturnRejected':
        return new ReturnRejectedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.reason as string,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'ReturnReceived':
        return new ReturnReceivedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.notes as string | null,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'RefundIssued':
        return new RefundIssuedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.refundAmount as number,
          payload.transactionId as string,
          payload.correlationId as string | undefined,
          entity.version,
        );
      default:
        throw new Error(`Unknown event type: ${entity.eventType}`);
    }
  }
}
