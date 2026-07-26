export interface ShipmentResult {
  success: boolean;
  shipmentId?: string;
  trackingNumber?: string;
  error?: string;
}

export interface ShipmentAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export abstract class ShipmentPort {
  abstract createShipment(
    orderId: string,
    items: Array<{ productId: string; quantity: number }>,
    address: ShipmentAddress,
    correlationId?: string,
  ): Promise<ShipmentResult>;
}
