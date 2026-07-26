import { Injectable, Logger } from '@nestjs/common';
import { ShipmentPort, ShipmentResult } from '../../application/ports/out/ShipmentPort';

@Injectable()
export class ShipmentPortStub extends ShipmentPort {
  private readonly logger = new Logger(ShipmentPortStub.name);

  async createShipment(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
    address: { street: string; city: string },
    correlationId?: string,
  ): Promise<ShipmentResult> {
    this.logger.log(
      `[STUB] Creating shipment for order ${orderId} to ${address.street}, ${address.city}`,
    );
    return {
      success: true,
      shipmentId: `ship-stub-${Date.now()}`,
      trackingNumber: `TRACK-${Date.now()}`,
    };
  }
}
