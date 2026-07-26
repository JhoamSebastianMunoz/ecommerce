import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReturnItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Product UUID' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 1, description: 'Quantity to return' })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 49.99, description: 'Unit price at purchase' })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export class RequestReturnRequestDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Order UUID' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ example: 'Product arrived damaged', description: 'Reason for return' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  reason!: string;

  @ApiProperty({ type: [ReturnItemDto], description: 'Items being returned' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items!: ReturnItemDto[];
}

export class ApproveReturnRequestDto {
  @ApiProperty({ example: 49.99, description: 'Refund amount' })
  @IsNumber()
  @Min(0.01)
  refundAmount!: number;
}

export class RejectReturnRequestDto {
  @ApiProperty({ example: 'Item does not meet return policy criteria', description: 'Rejection reason' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  reason!: string;
}

export class ReceiveReturnRequestDto {
  @ApiPropertyOptional({ example: 'Item received in good condition', description: 'Receiving notes' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

export class ReturnResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId!: string;

  @ApiProperty({ enum: ['REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUND_ISSUED'] })
  status!: string;

  @ApiProperty({ example: 'Product arrived damaged' })
  reason!: string;

  @ApiPropertyOptional({ example: 49.99 })
  refundAmount!: number | null;

  @ApiPropertyOptional({ example: 'txn-1234567890' })
  refundTransactionId!: string | null;

  @ApiPropertyOptional({ example: 'Item received in good condition' })
  notes!: string | null;

  @ApiProperty({ type: [ReturnItemDto] })
  items!: ReturnItemDto[];

  @ApiProperty({ example: '2026-07-26T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-26T10:00:00.000Z' })
  updatedAt!: string;
}
