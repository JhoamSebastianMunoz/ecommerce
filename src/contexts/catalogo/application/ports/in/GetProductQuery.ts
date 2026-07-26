import { Product } from '../../../domain/aggregates/Product';

export abstract class GetProductQuery {
  abstract execute(id: string): Promise<Product | null>;
}
