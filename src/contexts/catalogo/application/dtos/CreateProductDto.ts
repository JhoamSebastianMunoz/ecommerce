export class CreateProductDto {
  constructor(
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly stock: number,
    public readonly lowStockThreshold: number,
    public readonly categoryId: string | null,
    public readonly categoryName: string | null,
  ) {}
}
