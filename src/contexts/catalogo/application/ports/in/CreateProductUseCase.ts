import { Product } from '../../../domain/aggregates/Product';
import { CreateProductDto } from '../../dtos/CreateProductDto';

export abstract class CreateProductUseCase {
  abstract execute(dto: CreateProductDto): Promise<Product>;
}
