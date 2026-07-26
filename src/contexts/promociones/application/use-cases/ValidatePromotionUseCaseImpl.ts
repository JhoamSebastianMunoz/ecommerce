import { Injectable } from '@nestjs/common';
import { ValidatePromotionUseCase } from '../ports/in/ValidatePromotionUseCase';
import { PromotionRepository } from '../ports/out/PromotionRepository';
import { ValidatePromotionDto } from '../dtos/ValidatePromotionDto';

@Injectable()
export class ValidatePromotionUseCaseImpl extends ValidatePromotionUseCase {
  constructor(private readonly promotionRepository: PromotionRepository) {
    super();
  }

  async execute(dto: ValidatePromotionDto): Promise<boolean> {
    const promotion = await this.promotionRepository.findByCode(dto.code);
    if (!promotion) return false;
    return promotion.validate(dto.purchaseAmount);
  }
}
