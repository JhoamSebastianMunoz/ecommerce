import { Product } from '../../../domain/aggregates/Product';
import { AdjustStockDto } from '../../dtos/AdjustStockDto';

export abstract class AdjustStockUseCase {
  abstract execute(id: string, dto: AdjustStockDto): Promise<Product>;
}
