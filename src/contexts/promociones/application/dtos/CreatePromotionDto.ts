export class CreatePromotionDto {
  constructor(
    public readonly code: string,
    public readonly description: string,
    public readonly discountType: string,
    public readonly discountValue: number,
    public readonly minPurchaseAmount: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
