import { Injectable } from '@nestjs/common';
import { Cart } from '../../../domain/aggregates/Cart';
import { CartId } from '../../../domain/value-objects/CartId';
import { CustomerId } from '../../../domain/value-objects/CustomerId';
import { Quantity } from '../../../domain/value-objects/Quantity';
import { CartItemId } from '../../../domain/value-objects/CartItemId';
import { CartItem } from '../../../domain/entities/CartItem';
import { Money } from '../../../../../shared-kernel/domain/base/Money';
import { CartEntity } from '../entities/CartEntity';
import { CartItemEntity } from '../entities/CartItemEntity';

@Injectable()
export class CartMapper {
  toDomain(entity: CartEntity): Cart {
    const items = (entity.items ?? []).map((item) =>
      CartItem.create({
        id: CartItemId.fromString(item.id),
        productId: item.productId,
        quantity: Quantity.fromNumber(item.quantity),
        unitPrice: Money.fromNumber(Number(item.unitPrice)),
        createdAt: item.createdAt,
      }),
    );

    return Cart.reconstitute({
      id: CartId.fromString(entity.id),
      customerId: CustomerId.fromString(entity.customerId),
      items,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(cart: Cart): CartEntity {
    const entity = new CartEntity();
    entity.id = cart.id.toString();
    entity.customerId = cart.customerId.toString();
    entity.items = cart.items.map((item) => {
      const itemEntity = new CartItemEntity();
      itemEntity.id = item.id.toString();
      itemEntity.cartId = cart.id.toString();
      itemEntity.productId = item.productId;
      itemEntity.quantity = item.quantity.value;
      itemEntity.unitPrice = item.unitPrice.amount;
      return itemEntity;
    });
    return entity;
  }
}
