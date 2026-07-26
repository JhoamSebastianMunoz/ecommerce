import { CartItemResponseDto } from './CartItemResponseDto';

export class CartResponseDto {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: CartItemResponseDto[],
    public readonly itemCount: number,
    public readonly totalAmount: number,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
