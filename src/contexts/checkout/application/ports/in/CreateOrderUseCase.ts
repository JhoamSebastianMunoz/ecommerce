import { CreateOrderDto } from '../../dtos/CreateOrderDto';
import { OrderResponseDto } from '../../dtos/OrderResponseDto';

export abstract class CreateOrderUseCase {
  abstract execute(dto: CreateOrderDto): Promise<OrderResponseDto>;
}
