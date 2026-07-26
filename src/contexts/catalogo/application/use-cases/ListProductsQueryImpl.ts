import { Injectable } from '@nestjs/common';
import { ListProductsQuery, PaginatedResult } from '../ports/in/ListProductsQuery';
import { ProductRepository } from '../ports/out/ProductRepository';
import { Product } from '../../domain/aggregates/Product';
import { ProductFiltersDto } from '../dtos/ProductFiltersDto';

@Injectable()
export class ListProductsQueryImpl extends ListProductsQuery {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(filters: ProductFiltersDto): Promise<PaginatedResult<Product>> {
    const { data, total } = await this.productRepository.findAll({
      page: filters.page,
      limit: filters.limit,
      categoryId: filters.categoryId,
      status: filters.status,
      search: filters.search,
    });

    return { data, total, page: filters.page, limit: filters.limit };
  }
}
