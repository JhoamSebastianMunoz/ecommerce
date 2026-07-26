import { Injectable, NotFoundException } from '@nestjs/common';
import { ClearCartUseCase } from '../ports/in/ClearCartUseCase';
import { CartRepository } from '../ports/out/CartRepository';

@Injectable()
export class ClearCartUseCaseImpl extends ClearCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {
    super();
  }

  async execute(cartId: string): Promise<void> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    cart.clear();
    await this.cartRepository.save(cart);
  }
}
