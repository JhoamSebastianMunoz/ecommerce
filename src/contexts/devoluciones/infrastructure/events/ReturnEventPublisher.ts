import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';

@Injectable()
export class ReturnEventPublisher {
  private readonly logger = new Logger(ReturnEventPublisher.name);

  @OnEvent('ReturnRequested')
  handleReturnRequested(event: DomainEvent): void {
    this.logger.log(`Return requested: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('ReturnApproved')
  handleReturnApproved(event: DomainEvent): void {
    this.logger.log(`Return approved: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('ReturnRejected')
  handleReturnRejected(event: DomainEvent): void {
    this.logger.log(`Return rejected: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('ReturnReceived')
  handleReturnReceived(event: DomainEvent): void {
    this.logger.log(`Return received: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('RefundIssued')
  handleRefundIssued(event: DomainEvent): void {
    this.logger.log(`Refund issued: ${JSON.stringify(event.toJSON())}`);
  }
}
