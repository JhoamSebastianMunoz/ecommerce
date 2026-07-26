import { Cart } from '../../../domain/aggregates/Cart';
import { CreateCartDto } from '../../dtos/CreateCartDto';

export abstract class CreateCartUseCase {
  abstract execute(dto: CreateCartDto): Promise<Cart>;
}
