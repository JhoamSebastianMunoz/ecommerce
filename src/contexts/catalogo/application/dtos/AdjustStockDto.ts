export class AdjustStockDto {
  constructor(
    public readonly quantity: number,
    public readonly reason: string,
  ) {}
}
