import { Shipment } from '../../../domain/aggregates/Shipment';

export abstract class ShipmentRepository {
  abstract save(shipment: Shipment): Promise<void>;
  abstract findById(id: string): Promise<Shipment | null>;
  abstract findByOrderId(orderId: string): Promise<Shipment | null>;
  abstract findAll(): Promise<Shipment[]>;
}