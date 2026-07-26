import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplyPromotionUseCase } from '../ports/in/ApplyPromotionUseCase';
import { PromotionRepository } from '../ports/out/PromotionRepository';
import { ApplyPromotionDto } from '../dtos/ApplyPromotionDto';
import { ApplyPromotionResultDto } from '../dtos/ApplyPromotionResultDto';

@Injectable()
export class ApplyPromotionUseCaseImpl extends ApplyPromotionUseCase {
  constructor(private readonly promotionRepository: PromotionRepository) {
    super();
  }

  async execute(
    dto: ApplyPromotionDto,
    correlationId?: string,
  ): Promise<ApplyPromotionResultDto> {
    const promotion = await this.promotionRepository.findByCode(dto.code);
    if (!promotion) {
      throw new NotFoundException(`Promotion with code ${dto.code} not found`);
    }

    const { finalAmount, discountAmount } = promotion.applyDiscount(
      dto.originalAmount,
      correlationId,
    );

    await this.promotionRepository.save(promotion);

    return new ApplyPromotionResultDto(
      dto.originalAmount,
      discountAmount,
      finalAmount,
    );
  }
}
