import { Injectable, NotFoundException } from '@nestjs/common';
import { GetCartQuery } from '../ports/in/GetCartQuery';
import { CartRepository } from '../ports/out/CartRepository';
import { Cart } from '../../domain/aggregates/Cart';

@Injectable()
export class GetCartQueryImpl extends GetCartQuery {
  constructor(private readonly cartRepository: CartRepository) {
    super();
  }

  async execute(cartId: string): Promise<Cart | null> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }
    return cart;
  }
}
