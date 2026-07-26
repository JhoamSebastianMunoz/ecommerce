import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsIn,
} from 'class-validator';

export class CreatePaymentRequestDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Order UUID' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ example: 149.99, description: 'Payment amount' })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'TRANSFER'], example: 'CREDIT_CARD' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'TRANSFER'])
  paymentMethod!: string;

  @ApiPropertyOptional({ example: 'idem-001-abc', description: 'Idempotency key for safe retries' })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
