import { ApiProperty } from '@nestjs/swagger';

export class ApplyPromotionResultResponseDto {
  @ApiProperty({ example: 100 })
  originalAmount!: number;

  @ApiProperty({ example: 15 })
  discountAmount!: number;

  @ApiProperty({ example: 85 })
  finalAmount!: number;
}
