export class PromotionResponseDto {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly description: string,
    public readonly discountType: string,
    public readonly discountValue: number,
    public readonly minPurchaseAmount: number,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly isActive: boolean,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
