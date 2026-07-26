import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemResponseDto {
  @ApiProperty()
  productId!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  unitPrice!: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'customer-123' })
  customerId!: string;

  @ApiProperty({ example: 'PENDING' })
  status!: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiProperty({ example: 59.98 })
  totalAmount!: number;

  @ApiProperty({ example: 0 })
  discountAmount!: number;

  @ApiProperty({ example: '123 Main St, New York' })
  shippingAddress!: string;

  @ApiPropertyOptional({ example: 'idemp-001' })
  idempotencyKey?: string;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  updatedAt!: string;
}
