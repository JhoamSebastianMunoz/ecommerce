import { Injectable, Logger } from '@nestjs/common';
import { ShipmentPort, ShipmentResult, ShipmentAddress } from '../../../checkout/application/ports/out/ShipmentPort';
import { CreateShipmentUseCase } from '../../application/ports/in/shipment.ports.in';

@Injectable()
export class ShipmentPortAdapter extends ShipmentPort {
  private readonly logger = new Logger(ShipmentPortAdapter.name);

  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
  ) {
    super();
  }

  async createShipment(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
    address: ShipmentAddress,
    correlationId?: string,
  ): Promise<ShipmentResult> {
    try {
      this.logger.log(`Creating shipment for order ${orderId} with ${items.length} items`);
      if (items.length > 0) {
        this.logger.debug(`Shipment items: ${JSON.stringify(items)}`);
      }

      const trackingNumber = this.generateTrackingNumber();

      const shipment = await this.createShipmentUseCase.execute(
        {
          orderId,
          trackingNumber,
          address: {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
        },
        correlationId,
      );

      return {
        success: true,
        shipmentId: shipment.id,
        trackingNumber: shipment.trackingNumber,
      };
    } catch (error) {
      this.logger.error(`Shipment creation failed for order ${orderId}: ${(error as Error).message}`);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  private generateTrackingNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}