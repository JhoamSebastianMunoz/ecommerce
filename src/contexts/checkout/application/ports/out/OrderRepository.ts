import { Order } from '../../../domain/aggregates/Order';

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findByIdempotencyKey(key: string): Promise<Order | null>;
}
