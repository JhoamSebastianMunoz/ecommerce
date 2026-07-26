import { ApplyPromotionDto } from '../../dtos/ApplyPromotionDto';
import { ApplyPromotionResultDto } from '../../dtos/ApplyPromotionResultDto';

export abstract class ApplyPromotionUseCase {
  abstract execute(
    dto: ApplyPromotionDto,
    correlationId?: string,
  ): Promise<ApplyPromotionResultDto>;
}
