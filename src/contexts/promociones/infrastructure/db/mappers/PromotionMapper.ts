import { Injectable } from '@nestjs/common';
import { Promotion } from '../../../domain/aggregates/Promotion';
import { PromotionId } from '../../../domain/value-objects/PromotionId';
import { PromotionCode } from '../../../domain/value-objects/PromotionCode';
import { DiscountType } from '../../../domain/value-objects/DiscountType';
import { DiscountValue } from '../../../domain/value-objects/DiscountValue';
import { Money } from '../../../../../shared-kernel/domain/base/Money';
import { PromotionEntity } from '../entities/PromotionEntity';

@Injectable()
export class PromotionMapper {
  toDomain(entity: PromotionEntity): Promotion {
    return Promotion.reconstitute({
      id: PromotionId.fromString(entity.id),
      code: PromotionCode.fromString(entity.code),
      description: entity.description,
      discountType: DiscountType.fromString(entity.discountType),
      discountValue: DiscountValue.fromNumber(
        Number(entity.discountValue),
        DiscountType.fromString(entity.discountType),
      ),
      minPurchaseAmount: Money.fromNumber(Number(entity.minPurchaseAmount)),
      startDate: entity.startDate,
      endDate: entity.endDate,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(promotion: Promotion): PromotionEntity {
    const entity = new PromotionEntity();
    entity.id = promotion.id.toString();
    entity.code = promotion.code.toString();
    entity.description = promotion.description;
    entity.discountType = promotion.discountType.toString();
    entity.discountValue = promotion.discountValue.value;
    entity.minPurchaseAmount = promotion.minPurchaseAmount.amount;
    entity.startDate = promotion.startDate;
    entity.endDate = promotion.endDate;
    entity.isActive = promotion.isActive;
    return entity;
  }
}
