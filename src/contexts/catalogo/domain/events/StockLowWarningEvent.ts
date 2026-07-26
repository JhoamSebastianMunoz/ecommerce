import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

export class StockLowWarningEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly sku: string,
    public readonly currentStock: number,
    public readonly threshold: number,
    correlationId?: string,
  ) {
    super({ aggregateId, correlationId, eventType: 'StockLowWarning' });
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      sku: this.sku,
      currentStock: this.currentStock,
      threshold: this.threshold,
      occurredAt: this.occurredAt.toISOString(),
      correlationId: this.correlationId,
    };
  }
}
