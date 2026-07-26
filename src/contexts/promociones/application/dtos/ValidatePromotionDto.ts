export class ValidatePromotionDto {
  constructor(
    public readonly code: string,
    public readonly purchaseAmount: number,
  ) {}
}
