import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsISO8601,
} from 'class-validator';

export class CreatePromotionRequestDto {
  @ApiProperty({ example: 'SUMMER2026', description: 'Unique promotion code' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    example: 'Summer discount 2026',
    description: 'Promotion description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['PERCENTAGE', 'FIXED_AMOUNT'], example: 'PERCENTAGE' })
  @IsString()
  @IsNotEmpty()
  discountType!: string;

  @ApiProperty({
    example: 15,
    description: 'Discount value (percentage or fixed amount)',
  })
  @IsNumber()
  @Min(0.01)
  discountValue!: number;

  @ApiProperty({
    example: 50,
    description: 'Minimum purchase amount required',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPurchaseAmount?: number;

  @ApiProperty({
    example: '2026-08-01T00:00:00.000Z',
    description: 'Promotion start date',
  })
  @IsISO8601()
  startDate!: string;

  @ApiProperty({
    example: '2026-08-31T23:59:59.000Z',
    description: 'Promotion end date',
  })
  @IsISO8601()
  endDate!: string;
}
