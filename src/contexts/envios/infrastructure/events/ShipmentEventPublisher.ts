import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ShipmentEventPublisher {
  private readonly logger = new Logger(ShipmentEventPublisher.name);

  @OnEvent('ShipmentCreatedEvent', { async: true })
  handleShipmentCreated(event: any): void {
    this.logger.log(`Shipment created: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('ShipmentInTransitEvent', { async: true })
  handleShipmentInTransit(event: any): void {
    this.logger.log(`Shipment in transit: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('ShipmentDeliveredEvent', { async: true })
  handleShipmentDelivered(event: any): void {
    this.logger.log(`Shipment delivered: ${JSON.stringify(event.toJSON())}`);
  }

  @OnEvent('ShipmentFailedEvent', { async: true })
  handleShipmentFailed(event: any): void {
    this.logger.log(`Shipment failed: ${JSON.stringify(event.toJSON())}`);
  }
}