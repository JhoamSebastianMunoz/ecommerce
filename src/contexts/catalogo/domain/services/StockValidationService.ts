import { StockQuantity } from '../value-objects/StockQuantity';

export interface StockValidationResult {
  isValid: boolean;
  errors: string[];
}

export class StockValidationService {
  validate(available: StockQuantity, requested: number): StockValidationResult {
    const errors: string[] = [];
    if (!Number.isInteger(requested) || requested <= 0) {
      errors.push('Requested quantity must be a positive integer');
    }
    if (available.value < requested) {
      errors.push(`Insufficient stock: ${available.value} available, ${requested} requested`);
    }
    return { isValid: errors.length === 0, errors };
  }
}
