import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCartRequestDto {
  @ApiProperty({ example: 'customer-123', description: 'Customer ID or session ID' })
  @IsString()
  @IsNotEmpty()
  customerId!: string;
}
