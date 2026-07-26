import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

@Injectable()
export class CartEventPublisher {
  private readonly logger = new Logger(CartEventPublisher.name);

  @OnEvent('CartItemAdded')
  handleCartItemAdded(event: DomainEvent): void {
    this.logger.log(`Cart item added: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('CartItemRemoved')
  handleCartItemRemoved(event: DomainEvent): void {
    this.logger.log(`Cart item removed: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('CartAbandoned')
  handleCartAbandoned(event: DomainEvent): void {
    this.logger.log(`Cart abandoned: ${JSON.stringify(event.toJSON())}`);
  }
}
