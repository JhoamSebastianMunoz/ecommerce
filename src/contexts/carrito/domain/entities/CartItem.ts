import { Entity } from '../../../../shared-kernel/domain/base/Entity';
import { CartItemId } from '../value-objects/CartItemId';
import { Quantity } from '../value-objects/Quantity';
import { Money } from '../../../../shared-kernel/domain/base/Money';

export interface CartItemProps {
  id: CartItemId;
  productId: string;
  quantity: Quantity;
  unitPrice: Money;
  createdAt: Date;
}

export class CartItem implements Entity<string> {
  private constructor(
    public readonly id: CartItemId,
    public readonly productId: string,
    private _quantity: Quantity,
    private _unitPrice: Money,
    private _createdAt: Date,
  ) {}

  get quantity(): Quantity { return this._quantity; }
  get unitPrice(): Money { return this._unitPrice; }
  get createdAt(): Date { return this._createdAt; }

  get totalPrice(): Money {
    return this._unitPrice.multiplyBy(this._quantity.value);
  }

  static create(props: CartItemProps): CartItem {
    return new CartItem(
      props.id,
      props.productId,
      props.quantity,
      props.unitPrice,
      props.createdAt,
    );
  }

  updateQuantity(quantity: Quantity): void {
    this._quantity = quantity;
  }

  equals(other: Entity<string>): boolean {
    return other instanceof CartItem && this.id.equals(other.id);
  }
}
