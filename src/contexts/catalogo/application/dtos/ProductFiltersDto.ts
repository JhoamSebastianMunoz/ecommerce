export class ProductFiltersDto {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly categoryId?: string,
    public readonly status?: string,
    public readonly search?: string,
  ) {}
}
