import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class StockAdjustedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previousStock: number,
    public readonly newStock: number,
    public readonly reason: string,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'StockAdjusted' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      previousStock: this.previousStock,
      newStock: this.newStock,
      reason: this.reason,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
