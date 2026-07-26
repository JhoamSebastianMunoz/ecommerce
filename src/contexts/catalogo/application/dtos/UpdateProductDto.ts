export class UpdateProductDto {
  constructor(
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly price?: number,
    public readonly lowStockThreshold?: number,
    public readonly categoryId?: string | null,
    public readonly categoryName?: string | null,
  ) {}
}
