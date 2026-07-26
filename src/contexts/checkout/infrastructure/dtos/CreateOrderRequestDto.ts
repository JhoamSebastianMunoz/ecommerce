import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';

export class OrderItemRequestDto {
  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 29.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export class ShippingAddressRequestDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  street!: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State or province' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '10001', description: 'Postal/ZIP code' })
  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  @ApiProperty({ example: 'US', description: 'Country code (ISO 3166-1 alpha-2)' })
  @IsString()
  @IsNotEmpty()
  country!: string;
}

export class CreateOrderRequestDto {
  @ApiProperty({ example: 'customer-123' })
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ type: [OrderItemRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequestDto)
  items!: OrderItemRequestDto[];

  @ApiProperty({ type: ShippingAddressRequestDto })
  @ValidateNested()
  @Type(() => ShippingAddressRequestDto)
  shippingAddress!: ShippingAddressRequestDto;

  @ApiPropertyOptional({ example: 10.00, description: 'Discount amount' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiPropertyOptional({
    example: 'idemp-001',
    description: 'Unique key for idempotent order creation',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;

  @ApiPropertyOptional({
    example: '11111111-2222-3333-4444-555555555555',
    description: 'Cart ID (optional, for traceability)',
  })
  @IsUUID()
  @IsOptional()
  cartId?: string;
}
