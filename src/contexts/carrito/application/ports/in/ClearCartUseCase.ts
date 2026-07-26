export abstract class ClearCartUseCase {
  abstract execute(cartId: string): Promise<void>;
}
