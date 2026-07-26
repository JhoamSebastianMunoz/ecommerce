import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AddItemToCartUseCase } from '../ports/in/AddItemToCartUseCase';
import { CartRepository } from '../ports/out/CartRepository';
import { ProductQueryPort } from '../ports/out/ProductQueryPort';
import { Cart } from '../../domain/aggregates/Cart';
import { CustomerId } from '../../domain/value-objects/CustomerId';
import { Quantity } from '../../domain/value-objects/Quantity';
import { Money } from '../../../../shared-kernel/domain/base/Money';
import { AddItemToCartDto } from '../dtos/AddItemToCartDto';

@Injectable()
export class AddItemToCartUseCaseImpl extends AddItemToCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productQueryPort: ProductQueryPort,
  ) {
    super();
  }

  async execute(cartId: string, dto: AddItemToCartDto): Promise<Cart> {
    let cart = await this.cartRepository.findById(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart with id ${cartId} not found`);
    }

    const product = await this.productQueryPort.getProductById(dto.productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${dto.productId} not found`);
    }

    const quantity = Quantity.fromNumber(dto.quantity);
    if (quantity.value > product.stock) {
      throw new BadRequestException(
        `Insufficient stock: ${product.stock} available, ${dto.quantity} requested`,
      );
    }

    const unitPrice = Money.fromNumber(product.price);
    cart.addItem(dto.productId, quantity, unitPrice);
    await this.cartRepository.save(cart);
    return cart;
  }
}
