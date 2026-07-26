import { Product } from '../../../domain/aggregates/Product';

export interface FindAllOptions {
  page: number;
  limit: number;
  categoryId?: string;
  status?: string;
  search?: string;
}

export abstract class ProductRepository {
  abstract save(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findBySku(sku: string): Promise<Product | null>;
  abstract findAll(options: FindAllOptions): Promise<{ data: Product[]; total: number }>;
  abstract delete(id: string): Promise<void>;
}
