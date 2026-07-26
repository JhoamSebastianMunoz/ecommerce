import { Cart } from '../../../domain/aggregates/Cart';
import { AddItemToCartDto } from '../../dtos/AddItemToCartDto';

export abstract class AddItemToCartUseCase {
  abstract execute(cartId: string, dto: AddItemToCartDto): Promise<Cart>;
}
