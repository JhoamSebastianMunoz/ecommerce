import { Injectable, ConflictException } from '@nestjs/common';
import { CreatePromotionUseCase } from '../ports/in/CreatePromotionUseCase';
import { PromotionRepository } from '../ports/out/PromotionRepository';
import { Promotion } from '../../domain/aggregates/Promotion';
import { CreatePromotionDto } from '../dtos/CreatePromotionDto';

@Injectable()
export class CreatePromotionUseCaseImpl extends CreatePromotionUseCase {
  constructor(private readonly promotionRepository: PromotionRepository) {
    super();
  }

  async execute(dto: CreatePromotionDto): Promise<Promotion> {
    const existing = await this.promotionRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(
        `Promotion with code ${dto.code} already exists`,
      );
    }

    const promotion = Promotion.create({
      code: dto.code,
      description: dto.description,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minPurchaseAmount: dto.minPurchaseAmount,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    await this.promotionRepository.save(promotion);
    return promotion;
  }
}
