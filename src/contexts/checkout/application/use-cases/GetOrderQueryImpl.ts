import { Injectable, NotFoundException } from '@nestjs/common';
import { GetOrderQuery } from '../ports/in/GetOrderQuery';
import { OrderRepository } from '../ports/out/OrderRepository';
import { OrderResponseDto } from '../dtos/OrderResponseDto';

@Injectable()
export class GetOrderQueryImpl extends GetOrderQuery {
  constructor(private readonly orderRepository: OrderRepository) {
    super();
  }

  async execute(id: string): Promise<OrderResponseDto | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) return null;
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
