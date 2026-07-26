import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

@Injectable()
export class PromotionEventPublisher {
  private readonly logger = new Logger(PromotionEventPublisher.name);

  @OnEvent('PromotionApplied')
  handlePromotionApplied(event: DomainEvent): void {
    this.logger.log(`Promotion applied: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('PromotionExpired')
  handlePromotionExpired(event: DomainEvent): void {
    this.logger.log(`Promotion expired: ${JSON.stringify(event.toJSON())}`);
  }
}
