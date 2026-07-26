import { Promotion } from '../../../domain/aggregates/Promotion';
import { CreatePromotionDto } from '../../dtos/CreatePromotionDto';

export abstract class CreatePromotionUseCase {
  abstract execute(dto: CreatePromotionDto): Promise<Promotion>;
}
