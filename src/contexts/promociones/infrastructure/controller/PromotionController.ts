import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Promotion } from '../../domain/aggregates/Promotion';
import { CreatePromotionUseCase } from '../../application/ports/in/CreatePromotionUseCase';
import { ValidatePromotionUseCase } from '../../application/ports/in/ValidatePromotionUseCase';
import { ApplyPromotionUseCase } from '../../application/ports/in/ApplyPromotionUseCase';
import { DeactivatePromotionUseCase } from '../../application/ports/in/DeactivatePromotionUseCase';
import { PromotionRepository } from '../../application/ports/out/PromotionRepository';
import { CreatePromotionRequestDto } from '../dtos/CreatePromotionRequestDto';
import { ValidatePromotionRequestDto } from '../dtos/ValidatePromotionRequestDto';
import { ApplyPromotionRequestDto } from '../dtos/ApplyPromotionRequestDto';
import { PromotionResponseDto } from '../dtos/PromotionResponseDto';
import { ApplyPromotionResultResponseDto } from '../dtos/ApplyPromotionResultResponseDto';
import { CreatePromotionDto } from '../../application/dtos/CreatePromotionDto';
import { ValidatePromotionDto } from '../../application/dtos/ValidatePromotionDto';
import { ApplyPromotionDto } from '../../application/dtos/ApplyPromotionDto';
import { PROMOCIONES_ROUTES } from './routes.constants';

@ApiTags('Promociones')
@Controller()
export class PromotionController {
  constructor(
    private readonly createPromotionUseCase: CreatePromotionUseCase,
    private readonly validatePromotionUseCase: ValidatePromotionUseCase,
    private readonly applyPromotionUseCase: ApplyPromotionUseCase,
    private readonly deactivatePromotionUseCase: DeactivatePromotionUseCase,
    private readonly promotionRepository: PromotionRepository,
  ) {}

  @Post(PROMOCIONES_ROUTES.BASE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiResponse({
    status: 201,
    description: 'Promotion created',
    type: PromotionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Promotion code already exists' })
  async createPromotion(
    @Body() dto: CreatePromotionRequestDto,
  ): Promise<PromotionResponseDto> {
    const promotion = await this.createPromotionUseCase.execute(
      new CreatePromotionDto(
        dto.code,
        dto.description ?? '',
        dto.discountType,
        dto.discountValue,
        dto.minPurchaseAmount ?? 0,
        new Date(dto.startDate),
        new Date(dto.endDate),
      ),
    );
    return this.toResponseDto(promotion);
  }

  @Get(PROMOCIONES_ROUTES.BASE)
  @ApiOperation({ summary: 'List all promotions' })
  @ApiResponse({
    status: 200,
    description: 'List of promotions',
    type: [PromotionResponseDto],
  })
  async listPromotions(): Promise<PromotionResponseDto[]> {
    const promotions = await this.promotionRepository.findAll();
    return promotions.map((p) => this.toResponseDto(p));
  }

  @Get(PROMOCIONES_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Get promotion by ID' })
  @ApiParam({ name: 'id', description: 'Promotion UUID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion found',
    type: PromotionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  async getPromotion(@Param('id') id: string): Promise<PromotionResponseDto> {
    const promotion = await this.promotionRepository.findById(id);
    return this.toResponseDto(promotion!);
  }

  @Post(PROMOCIONES_ROUTES.VALIDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate if a promotion is applicable' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validatePromotion(
    @Body() dto: ValidatePromotionRequestDto,
  ): Promise<{ valid: boolean }> {
    const valid = await this.validatePromotionUseCase.execute(
      new ValidatePromotionDto(dto.code, dto.purchaseAmount),
    );
    return { valid };
  }

  @Post(PROMOCIONES_ROUTES.APPLY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply a promotion to an amount' })
  @ApiResponse({
    status: 200,
    description: 'Discount applied',
    type: ApplyPromotionResultResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Promotion not found or not applicable',
  })
  async applyPromotion(
    @Body() dto: ApplyPromotionRequestDto,
  ): Promise<ApplyPromotionResultResponseDto> {
    const result = await this.applyPromotionUseCase.execute(
      new ApplyPromotionDto(dto.code, dto.originalAmount),
    );
    return {
      originalAmount: result.originalAmount,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    };
  }

  @Patch(PROMOCIONES_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Deactivate a promotion' })
  @ApiParam({ name: 'id', description: 'Promotion UUID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion deactivated',
    type: PromotionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  async deactivatePromotion(
    @Param('id') id: string,
  ): Promise<PromotionResponseDto> {
    await this.deactivatePromotionUseCase.execute(id);
    const promotion = await this.promotionRepository.findById(id);
    return this.toResponseDto(promotion!);
  }

  private toResponseDto(promotion: Promotion): PromotionResponseDto {
    return {
      id: promotion.id.toString(),
      code: promotion.code.toString(),
      description: promotion.description,
      discountType: promotion.discountType.toString(),
      discountValue: promotion.discountValue.value,
      minPurchaseAmount: promotion.minPurchaseAmount.amount,
      startDate: promotion.startDate.toISOString(),
      endDate: promotion.endDate.toISOString(),
      isActive: promotion.isActive,
      createdAt: promotion.createdAt.toISOString(),
      updatedAt: promotion.updatedAt.toISOString(),
    };
  }
}
