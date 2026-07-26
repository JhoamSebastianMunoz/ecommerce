import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../../../../shared-kernel/domain/base/DomainEvent';
import { PaymentInitiatedEvent } from '../../../domain/events/PaymentInitiatedEvent';
import { PaymentAuthorizedEvent } from '../../../domain/events/PaymentAuthorizedEvent';
import { PaymentCapturedEvent } from '../../../domain/events/PaymentCapturedEvent';
import { PaymentFailedEvent } from '../../../domain/events/PaymentFailedEvent';
import { PaymentRefundedEvent } from '../../../domain/events/PaymentRefundedEvent';
import { PaymentEventEntity } from '../entities/PaymentEventEntity';

@Injectable()
export class PaymentEventMapper {
  toEntity(event: DomainEvent): PaymentEventEntity {
    const entity = new PaymentEventEntity();
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

  toDomain(entity: PaymentEventEntity): DomainEvent {
    const payload = entity.payload;
    switch (entity.eventType) {
      case 'PaymentInitiated':
        return new PaymentInitiatedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.amount as number,
          payload.paymentMethod as string,
          payload.idempotencyKey as string | undefined,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'PaymentAuthorized':
        return new PaymentAuthorizedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'PaymentCaptured':
        return new PaymentCapturedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.transactionId as string,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'PaymentFailed':
        return new PaymentFailedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.reason as string,
          payload.correlationId as string | undefined,
          entity.version,
        );
      case 'PaymentRefunded':
        return new PaymentRefundedEvent(
          entity.aggregateId,
          payload.orderId as string,
          payload.transactionId as string,
          payload.correlationId as string | undefined,
          entity.version,
        );
      default:
        throw new Error(`Unknown event type: ${entity.eventType}`);
    }
  }
}
