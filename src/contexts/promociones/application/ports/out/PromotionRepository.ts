import { Promotion } from '../../../domain/aggregates/Promotion';

export abstract class PromotionRepository {
  abstract save(promotion: Promotion): Promise<void>;
  abstract findById(id: string): Promise<Promotion | null>;
  abstract findByCode(code: string): Promise<Promotion | null>;
  abstract findAll(): Promise<Promotion[]>;
  abstract delete(id: string): Promise<void>;
}
