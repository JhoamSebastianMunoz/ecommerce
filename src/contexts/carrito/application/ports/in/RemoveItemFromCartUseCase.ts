import { Cart } from '../../../domain/aggregates/Cart';

export abstract class RemoveItemFromCartUseCase {
  abstract execute(cartId: string, productId: string): Promise<Cart>;
}
