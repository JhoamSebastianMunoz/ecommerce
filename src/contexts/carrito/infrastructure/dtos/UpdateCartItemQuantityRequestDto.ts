import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemQuantityRequestDto {
  @ApiProperty({ example: 3, description: 'New quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}
