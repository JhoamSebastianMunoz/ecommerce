import { Product } from '../../../domain/aggregates/Product';
import { UpdateProductDto } from '../../dtos/UpdateProductDto';

export abstract class UpdateProductUseCase {
  abstract execute(id: string, dto: UpdateProductDto): Promise<Product>;
}
