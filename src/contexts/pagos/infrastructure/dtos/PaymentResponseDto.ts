import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  orderId!: string;

  @ApiProperty({ enum: ['INITIATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'], example: 'INITIATED' })
  status!: string;

  @ApiProperty({ example: 149.99 })
  amount!: number;

  @ApiProperty({ enum: ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'TRANSFER'], example: 'CREDIT_CARD' })
  paymentMethod!: string;

  @ApiPropertyOptional({ example: 'txn-1234567890' })
  transactionId!: string | null;

  @ApiPropertyOptional({ example: 'idem-001-abc' })
  idempotencyKey!: string | null;

  @ApiPropertyOptional({ example: 'Insufficient funds' })
  failureReason!: string | null;

  @ApiProperty({ example: '2026-07-26T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-26T10:00:00.000Z' })
  updatedAt!: string;
}
