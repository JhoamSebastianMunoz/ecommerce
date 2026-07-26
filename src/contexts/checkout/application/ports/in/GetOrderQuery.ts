import { OrderResponseDto } from '../../dtos/OrderResponseDto';

export abstract class GetOrderQuery {
  abstract execute(id: string): Promise<OrderResponseDto | null>;
}
