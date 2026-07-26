import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class PromotionExpiredEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly promotionCode: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'PromotionExpired' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      promotionCode: this.promotionCode,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
