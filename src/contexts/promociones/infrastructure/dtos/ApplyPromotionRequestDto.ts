import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ApplyPromotionRequestDto {
  @ApiProperty({
    example: 'SUMMER2026',
    description: 'Promotion code to apply',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 100, description: 'Original amount before discount' })
  @IsNumber()
  @Min(0.01)
  originalAmount!: number;
}
