import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Cart } from '../../domain/aggregates/Cart';
import { CreateCartUseCase } from '../../application/ports/in/CreateCartUseCase';
import { AddItemToCartUseCase } from '../../application/ports/in/AddItemToCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../application/ports/in/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from '../../application/ports/in/RemoveItemFromCartUseCase';
import { GetCartQuery } from '../../application/ports/in/GetCartQuery';
import { ClearCartUseCase } from '../../application/ports/in/ClearCartUseCase';
import { CreateCartRequestDto } from '../dtos/CreateCartRequestDto';
import { AddItemToCartRequestDto } from '../dtos/AddItemToCartRequestDto';
import { UpdateCartItemQuantityRequestDto } from '../dtos/UpdateCartItemQuantityRequestDto';
import { CartResponseDto } from '../dtos/CartResponseDto';
import { CartItemResponseDto } from '../dtos/CartItemResponseDto';
import { CreateCartDto } from '../../application/dtos/CreateCartDto';
import { AddItemToCartDto } from '../../application/dtos/AddItemToCartDto';
import { UpdateCartItemQuantityDto } from '../../application/dtos/UpdateCartItemQuantityDto';
import { CARRITO_ROUTES } from './routes.constants';

@ApiTags('Carrito')
@Controller()
export class CartController {
  constructor(
    private readonly createCartUseCase: CreateCartUseCase,
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
    private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
    private readonly getCartQuery: GetCartQuery,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  @Post(CARRITO_ROUTES.BASE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({ status: 201, description: 'Cart created', type: CartResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createCart(@Body() dto: CreateCartRequestDto): Promise<CartResponseDto> {
    const cart = await this.createCartUseCase.execute(
      new CreateCartDto(dto.customerId),
    );
    return this.toResponseDto(cart);
  }

  @Get(CARRITO_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiParam({ name: 'cartId', description: 'Cart UUID' })
  @ApiResponse({ status: 200, description: 'Cart found', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(@Param('cartId') cartId: string): Promise<CartResponseDto> {
    const cart = await this.getCartQuery.execute(cartId);
    return this.toResponseDto(cart!);
  }

  @Post(CARRITO_ROUTES.ITEMS)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiParam({ name: 'cartId', description: 'Cart UUID' })
  @ApiResponse({ status: 201, description: 'Item added to cart', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart or product not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async addItem(
    @Param('cartId') cartId: string,
    @Body() dto: AddItemToCartRequestDto,
  ): Promise<CartResponseDto> {
    const cart = await this.addItemToCartUseCase.execute(
      cartId,
      new AddItemToCartDto(dto.productId, dto.quantity),
    );
    return this.toResponseDto(cart);
  }

  @Patch(CARRITO_ROUTES.ITEM_BY_PRODUCT)
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'cartId', description: 'Cart UUID' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Item quantity updated', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async updateItemQuantity(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemQuantityRequestDto,
  ): Promise<CartResponseDto> {
    const cart = await this.updateCartItemQuantityUseCase.execute(
      cartId,
      productId,
      new UpdateCartItemQuantityDto(dto.quantity),
    );
    return this.toResponseDto(cart);
  }

  @Delete(CARRITO_ROUTES.ITEM_BY_PRODUCT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'cartId', description: 'Cart UUID' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Item removed from cart', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  async removeItem(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): Promise<CartResponseDto> {
    const cart = await this.removeItemFromCartUseCase.execute(cartId, productId);
    return this.toResponseDto(cart);
  }

  @Delete(CARRITO_ROUTES.BY_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiParam({ name: 'cartId', description: 'Cart UUID' })
  @ApiResponse({ status: 204, description: 'Cart cleared' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async clearCart(@Param('cartId') cartId: string): Promise<void> {
    await this.clearCartUseCase.execute(cartId);
  }

  private toResponseDto(cart: Cart): CartResponseDto {
    const items = cart.items.map(
      (item) =>
        ({
          id: item.id.toString(),
          productId: item.productId,
          quantity: item.quantity.value,
          unitPrice: item.unitPrice.amount,
          totalPrice: item.totalPrice.amount,
          createdAt: item.createdAt.toISOString(),
        }) as CartItemResponseDto,
    );

    return {
      id: cart.id.toString(),
      customerId: cart.customerId.toString(),
      items,
      itemCount: cart.itemCount,
      totalAmount: cart.totalAmount.amount,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    } as CartResponseDto;
  }
}
