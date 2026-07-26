import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from '../../domain/events/ProductCreatedEvent';
import { StockAdjustedEvent } from '../../domain/events/StockAdjustedEvent';
import { StockLowWarningEvent } from '../../domain/events/StockLowWarningEvent';

@Injectable()
export class ProductEventPublisher {
  @OnEvent('ProductCreated')
  handleProductCreated(event: ProductCreatedEvent): void {
    console.log(`[Event] ProductCreated: ${event.name} (SKU: ${event.sku})`);
  }

  @OnEvent('StockAdjusted')
  handleStockAdjusted(event: StockAdjustedEvent): void {
    console.log(
      `[Event] StockAdjusted: Product ${event.aggregateId} ` +
      `from ${event.previousStock} to ${event.newStock} - Reason: ${event.reason}`,
    );
  }

  @OnEvent('StockLowWarning')
  handleStockLowWarning(event: StockLowWarningEvent): void {
    console.warn(
      `[WARN] StockLowWarning: Product ${event.aggregateId} (SKU: ${event.sku}) ` +
      `has only ${event.currentStock} units (threshold: ${event.threshold})`,
    );
  }
}
