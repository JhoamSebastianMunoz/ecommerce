import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './CartItemResponseDto';

export class CartResponseDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'customer-123' })
  customerId!: string;

  @ApiProperty({ type: [CartItemResponseDto] })
  items!: CartItemResponseDto[];

  @ApiProperty({ example: 3 })
  itemCount!: number;

  @ApiProperty({ example: 4499.97 })
  totalAmount!: number;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  updatedAt!: string;
}
