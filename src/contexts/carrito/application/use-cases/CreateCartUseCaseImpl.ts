import { Injectable } from '@nestjs/common';
import { CreateCartUseCase } from '../ports/in/CreateCartUseCase';
import { CartRepository } from '../ports/out/CartRepository';
import { Cart } from '../../domain/aggregates/Cart';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { CreateCartDto } from '../dtos/CreateCartDto';

@Injectable()
export class CreateCartUseCaseImpl extends CreateCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {
    super();
  }

  async execute(dto: CreateCartDto): Promise<Cart> {
    const customerId = CustomerId.fromString(dto.customerId);
    const existingCart = await this.cartRepository.findByCustomerId(dto.customerId);
    if (existingCart) {
      return existingCart;
    }
    const cart = Cart.create(customerId);
    await this.cartRepository.save(cart);
    return cart;
  }
}
