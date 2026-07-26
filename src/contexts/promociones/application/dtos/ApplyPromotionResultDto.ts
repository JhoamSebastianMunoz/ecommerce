export class ApplyPromotionResultDto {
  constructor(
    public readonly originalAmount: number,
    public readonly discountAmount: number,
    public readonly finalAmount: number,
  ) {}
}
