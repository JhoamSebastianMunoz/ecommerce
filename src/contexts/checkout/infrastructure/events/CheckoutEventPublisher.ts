import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

@Injectable()
export class CheckoutEventPublisher {
  private readonly logger = new Logger(CheckoutEventPublisher.name);

  @OnEvent('OrderPlaced')
  handleOrderPlaced(event: DomainEvent): void {
    this.logger.log(`Order placed: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('StockReserved')
  handleStockReserved(event: DomainEvent): void {
    this.logger.log(`Stock reserved: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('OrderConfirmed')
  handleOrderConfirmed(event: DomainEvent): void {
    this.logger.log(`Order confirmed: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('OrderFailed')
  handleOrderFailed(event: DomainEvent): void {
    this.logger.log(`Order failed: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('OrderCancelled')
  handleOrderCancelled(event: DomainEvent): void {
    this.logger.log(`Order cancelled: ${JSON.stringify(event.toJSON())}`);
  }
}
