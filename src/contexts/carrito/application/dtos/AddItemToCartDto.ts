export class AddItemToCartDto {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}
