import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderUseCase } from '../ports/in/CreateOrderUseCase';
import { OrderRepository } from '../ports/out/OrderRepository';
import { Order } from '../../domain/aggregates/Order';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { OrderResponseDto } from '../dtos/OrderResponseDto';
import { CheckoutSaga } from '../saga/CheckoutSaga';

@Injectable()
export class CreateOrderUseCaseImpl extends CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCaseImpl.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly checkoutSaga: CheckoutSaga,
  ) {
    super();
  }

  async execute(dto: CreateOrderDto): Promise<OrderResponseDto> {
    if (dto.idempotencyKey) {
      const existing = await this.orderRepository.findByIdempotencyKey(
        dto.idempotencyKey,
      );
      if (existing) {
        this.logger.log(
          `Order already exists for idempotency key ${dto.idempotencyKey}`,
        );
        return this.toResponseDto(existing);
      }
    }

    const order = Order.create({
      customerId: dto.customerId,
      items: dto.items,
      shippingAddress: dto.shippingAddress,
      discountAmount: dto.discountAmount,
      idempotencyKey: dto.idempotencyKey,
    });

    await this.orderRepository.save(order);

    this.checkoutSaga.execute(order.id.toString()).catch((err) => {
      this.logger.error(`Saga execution failed for order ${order.id}: ${err.message}`);
    });

    return this.toResponseDto(order);
  }

  private toResponseDto(order: Order): OrderResponseDto {
    return new OrderResponseDto(
      order.id.toString(),
      order.customerId,
      order.status.toString(),
      order.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      order.totalAmount.amount,
      order.discountAmount.amount,
      order.shippingAddress.toString(),
      order.createdAt.toISOString(),
      order.updatedAt.toISOString(),
      order.idempotencyKey,
    );
  }
}
