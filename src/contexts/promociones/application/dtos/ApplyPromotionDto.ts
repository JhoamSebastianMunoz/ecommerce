export class ApplyPromotionDto {
  constructor(
    public readonly code: string,
    public readonly originalAmount: number,
  ) {}
}
