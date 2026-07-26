import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class AdjustStockRequestDto {
  @ApiProperty({ example: -2, description: 'Quantity to adjust (positive to add, negative to remove)' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 'venta', description: 'Reason for the stock adjustment' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
