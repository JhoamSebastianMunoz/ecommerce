import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateCartItemQuantityUseCase } from '../ports/in/UpdateCartItemQuantityUseCase';
import { CartRepository } from '../ports/out/CartRepository';
import { ProductQueryPort } from '../ports/out/ProductQueryPort';
import { Cart } from '../../domain/aggregates/Cart';
import { Quantity } from '../../domain/value-objects/Quantity';
import { UpdateCartItemQuantityDto } from '../dtos/UpdateCartItemQuantityDto';

@Injectable()
export class UpdateCartItemQuantityUseCaseImpl extends UpdateCartItemQuantityUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productQueryPort: ProductQueryPort,
  ) {
    super();
  }

  async execute(cartId: string, productId: string, dto: UpdateCartItemQuantityDto): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    const cartItem = cart.items.find((i) => i.productId === productId);
    if (!cartItem) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    const quantity = Quantity.fromNumber(dto.quantity);

    const stock = await this.productQueryPort.getStock(productId);
    if (quantity.value > stock) {
      throw new BadRequestException(
        `Insufficient stock: ${stock} available, ${dto.quantity} requested`,
      );
    }

    cart.updateItemQuantity(productId, quantity);
    await this.cartRepository.save(cart);
    return cart;
  }
}
