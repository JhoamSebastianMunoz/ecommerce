import { Product } from '../../../domain/aggregates/Product';
import { ProductFiltersDto } from '../../dtos/ProductFiltersDto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export abstract class ListProductsQuery {
  abstract execute(filters: ProductFiltersDto): Promise<PaginatedResult<Product>>;
}
