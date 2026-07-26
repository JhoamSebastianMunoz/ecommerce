import { Injectable } from '@nestjs/common';
import { Order, OrderItem } from '../../../domain/aggregates/Order';
import { OrderId } from '../../../domain/value-objects/OrderId';
import { OrderStatus } from '../../../domain/value-objects/OrderStatus';
import { ShippingAddress } from '../../../domain/value-objects/ShippingAddress';
import { Money } from '../../../../../shared-kernel/domain/base/Money';
import { OrderEntity } from '../entities/OrderEntity';
import { OrderItemEntity } from '../entities/OrderItemEntity';

@Injectable()
export class OrderMapper {
  toDomain(entity: OrderEntity): Order {
    return Order.reconstitute({
      id: OrderId.fromString(entity.id),
      customerId: entity.customerId,
      status: OrderStatus.fromString(entity.status),
      items: entity.items.map(
        (i) => new OrderItem(i.productId, i.quantity, Number(i.unitPrice)),
      ),
      totalAmount: Money.fromNumber(Number(entity.totalAmount)),
      discountAmount: Money.fromNumber(Number(entity.discountAmount)),
      shippingAddress: ShippingAddress.create(
        entity.shippingStreet,
        entity.shippingCity,
      ),
      idempotencyKey: entity.idempotencyKey,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(order: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = order.id.toString();
    entity.customerId = order.customerId;
    entity.status = order.status.toString();
    entity.totalAmount = order.totalAmount.amount;
    entity.discountAmount = order.discountAmount.amount;
    entity.shippingStreet = order.shippingAddress.street;
    entity.shippingCity = order.shippingAddress.city;
    entity.idempotencyKey = order.idempotencyKey;
    entity.items = order.items.map((item) => {
      const itemEntity = new OrderItemEntity();
      itemEntity.productId = item.productId;
      itemEntity.quantity = item.quantity;
      itemEntity.unitPrice = item.unitPrice;
      return itemEntity;
    });
    return entity;
  }
}
