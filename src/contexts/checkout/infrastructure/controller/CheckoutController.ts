import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateOrderUseCase } from '../../application/ports/in/CreateOrderUseCase';
import { GetOrderQuery } from '../../application/ports/in/GetOrderQuery';
import { CreateOrderRequestDto } from '../dtos/CreateOrderRequestDto';
import { OrderResponseDto as OrderHttpResponseDto } from '../dtos/OrderResponseDto';
import { CreateOrderDto } from '../../application/dtos/CreateOrderDto';
import { CHECKOUT_ROUTES } from './routes.constants';

@ApiTags('Checkout')
@Controller()
export class CheckoutController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderQuery: GetOrderQuery,
  ) {}

  @Post(CHECKOUT_ROUTES.ORDERS)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order (checkout)' })
  @ApiResponse({
    status: 201,
    description: 'Order created',
    type: OrderHttpResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Idempotency key conflict' })
  async createOrder(
    @Body() dto: CreateOrderRequestDto,
  ): Promise<OrderHttpResponseDto> {
    const result = await this.createOrderUseCase.execute(
      new CreateOrderDto(
        dto.customerId,
        dto.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        {
          street: dto.shippingAddress.street,
          city: dto.shippingAddress.city,
          state: dto.shippingAddress.state,
          postalCode: dto.shippingAddress.postalCode,
          country: dto.shippingAddress.country,
        },
        dto.discountAmount,
        dto.idempotencyKey,
        dto.cartId,
      ),
    );

    return {
      id: result.id,
      customerId: result.customerId,
      status: result.status,
      items: result.items,
      totalAmount: result.totalAmount,
      discountAmount: result.discountAmount,
      shippingAddress: result.shippingAddress,
      idempotencyKey: result.idempotencyKey,
      cartId: result.cartId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Get(CHECKOUT_ROUTES.ORDER_BY_ID)
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    type: OrderHttpResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderHttpResponseDto> {
    const result = await this.getOrderQuery.execute(id);
    if (!result) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return {
      id: result.id,
      customerId: result.customerId,
      status: result.status,
      items: result.items,
      totalAmount: result.totalAmount,
      discountAmount: result.discountAmount,
      shippingAddress: result.shippingAddress,
      idempotencyKey: result.idempotencyKey,
      cartId: result.cartId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
