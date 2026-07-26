import { Cart } from '../../../domain/aggregates/Cart';
import { UpdateCartItemQuantityDto } from '../../dtos/UpdateCartItemQuantityDto';

export abstract class UpdateCartItemQuantityUseCase {
  abstract execute(cartId: string, productId: string, dto: UpdateCartItemQuantityDto): Promise<Cart>;
}
