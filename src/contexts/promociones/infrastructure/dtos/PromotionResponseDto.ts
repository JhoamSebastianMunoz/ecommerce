import { ApiProperty } from '@nestjs/swagger';

export class PromotionResponseDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'SUMMER2026' })
  code!: string;

  @ApiProperty({ example: 'Summer discount 2026' })
  description!: string;

  @ApiProperty({ example: 'PERCENTAGE' })
  discountType!: string;

  @ApiProperty({ example: 15 })
  discountValue!: number;

  @ApiProperty({ example: 50 })
  minPurchaseAmount!: number;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z' })
  startDate!: string;

  @ApiProperty({ example: '2026-08-31T23:59:59.000Z' })
  endDate!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  updatedAt!: string;
}
