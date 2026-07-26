import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  @OnEvent('PaymentInitiated')
  handlePaymentInitiated(event: DomainEvent): void {
    this.logger.log(`Payment initiated: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('PaymentAuthorized')
  handlePaymentAuthorized(event: DomainEvent): void {
    this.logger.log(`Payment authorized: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('PaymentCaptured')
  handlePaymentCaptured(event: DomainEvent): void {
    this.logger.log(`Payment captured: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('PaymentFailed')
  handlePaymentFailed(event: DomainEvent): void {
    this.logger.log(`Payment failed: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('PaymentRefunded')
  handlePaymentRefunded(event: DomainEvent): void {
    this.logger.log(`Payment refunded: ${JSON.stringify(event.toJSON())}`);
  }
}
