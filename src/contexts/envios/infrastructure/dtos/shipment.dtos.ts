import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateShipmentRequestDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Order ID' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ example: 'TRACK1234567890', description: 'Tracking number' })
  @IsString()
  @IsNotEmpty()
  trackingNumber!: string;

  @ApiProperty({ example: '123 Main St', description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street!: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State/Province' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ example: '10001', description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  postalCode!: string;

  @ApiProperty({ example: 'US', description: 'Country code (ISO 2-letter)' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  country!: string;
}

export class UpdateTrackingStatusRequestDto {
  @ApiProperty({ enum: ['IN_TRANSIT', 'DELIVERED', 'FAILED'], example: 'IN_TRANSIT' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['IN_TRANSIT', 'DELIVERED', 'FAILED'])
  status!: string;

  @ApiPropertyOptional({ example: 'Package damaged in transit', description: 'Failure reason (required if status=FAILED)' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class AddressResponseDto {
  @ApiProperty({ example: '123 Main St' })
  street!: string;

  @ApiProperty({ example: 'New York' })
  city!: string;

  @ApiPropertyOptional({ example: 'NY' })
  state?: string;

  @ApiProperty({ example: '10001' })
  postalCode!: string;

  @ApiProperty({ example: 'US' })
  country!: string;
}

export class ShipmentResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  orderId!: string;

  @ApiProperty({ example: 'TRACK1234567890' })
  trackingNumber!: string;

  @ApiProperty({ type: AddressResponseDto })
  address!: AddressResponseDto;

  @ApiProperty({ enum: ['CREATED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'], example: 'CREATED' })
  status!: string;

  @ApiProperty({ example: '2026-07-26T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-26T10:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ example: '2026-07-26T12:00:00.000Z' })
  shippedAt?: Date;

  @ApiPropertyOptional({ example: '2026-07-28T15:00:00.000Z' })
  deliveredAt?: Date;
}