export interface CreateShipmentDto {
  orderId: string;
  trackingNumber: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

export interface ShipmentResponseDto {
  id: string;
  orderId: string;
  trackingNumber: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface UpdateTrackingStatusDto {
  status: 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  reason?: string;
}