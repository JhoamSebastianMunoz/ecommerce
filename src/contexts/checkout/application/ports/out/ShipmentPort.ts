export interface ShipmentResult {
  success: boolean;
  shipmentId?: string;
  trackingNumber?: string;
  error?: string;
}

export abstract class ShipmentPort {
  abstract createShipment(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
    address: { street: string; city: string },
    correlationId?: string,
  ): Promise<ShipmentResult>;
}
