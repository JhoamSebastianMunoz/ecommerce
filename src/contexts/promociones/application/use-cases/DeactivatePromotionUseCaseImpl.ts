import { Injectable, NotFoundException } from '@nestjs/common';
import { DeactivatePromotionUseCase } from '../ports/in/DeactivatePromotionUseCase';
import { PromotionRepository } from '../ports/out/PromotionRepository';

@Injectable()
export class DeactivatePromotionUseCaseImpl extends DeactivatePromotionUseCase {
  constructor(private readonly promotionRepository: PromotionRepository) {
    super();
  }

  async execute(id: string, correlationId?: string): Promise<void> {
    const promotion = await this.promotionRepository.findById(id);
    if (!promotion) {
      throw new NotFoundException(`Promotion with id ${id} not found`);
    }
    promotion.deactivate(correlationId);
    await this.promotionRepository.save(promotion);
  }
}
