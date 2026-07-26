import { Cart } from '../../../domain/aggregates/Cart';

export abstract class GetCartQuery {
  abstract execute(cartId: string): Promise<Cart | null>;
}
