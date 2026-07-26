import { ValidatePromotionDto } from '../../dtos/ValidatePromotionDto';

export abstract class ValidatePromotionUseCase {
  abstract execute(dto: ValidatePromotionDto): Promise<boolean>;
}
