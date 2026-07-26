export abstract class DeleteProductUseCase {
  abstract execute(id: string): Promise<void>;
}
