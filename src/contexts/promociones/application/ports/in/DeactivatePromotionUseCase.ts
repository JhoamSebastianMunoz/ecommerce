export abstract class DeactivatePromotionUseCase {
  abstract execute(id: string, correlationId?: string): Promise<void>;
}
