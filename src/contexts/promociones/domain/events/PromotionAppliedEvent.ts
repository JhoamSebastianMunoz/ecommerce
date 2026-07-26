import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class PromotionAppliedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly promotionCode: string,
    public readonly originalAmount: number,
    public readonly discountAmount: number,
    public readonly finalAmount: number,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'PromotionApplied' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      promotionCode: this.promotionCode,
      originalAmount: this.originalAmount,
      discountAmount: this.discountAmount,
      finalAmount: this.finalAmount,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
