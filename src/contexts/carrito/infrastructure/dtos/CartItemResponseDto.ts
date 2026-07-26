import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  productId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 1499.99 })
  unitPrice!: number;

  @ApiProperty({ example: 2999.98 })
  totalPrice!: number;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  createdAt!: string;
}
