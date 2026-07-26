import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ValidatePromotionRequestDto {
  @ApiProperty({
    example: 'SUMMER2026',
    description: 'Promotion code to validate',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    example: 100,
    description: 'Purchase amount to validate against',
  })
  @IsNumber()
  @Min(0)
  purchaseAmount!: number;
}
