import { Injectable, NotFoundException } from '@nestjs/common';
import { RemoveItemFromCartUseCase } from '../ports/in/RemoveItemFromCartUseCase';
import { CartRepository } from '../ports/out/CartRepository';
import { Cart } from '../../domain/aggregates/Cart';

@Injectable()
export class RemoveItemFromCartUseCaseImpl extends RemoveItemFromCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {
    super();
  }

  async execute(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    cart.removeItem(productId);
    await this.cartRepository.save(cart);
    return cart;
  }
}
