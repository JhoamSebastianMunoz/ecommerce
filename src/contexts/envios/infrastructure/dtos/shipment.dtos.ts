import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
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
  street!: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State/Province' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '10001', description: 'Postal code' })
  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  @ApiProperty({ example: 'US', description: 'Country code (ISO 2-letter)' })
  @IsString()
  @IsNotEmpty()
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

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  shippedAt?: Date;

  @ApiPropertyOptional()
  deliveredAt?: Date;
}