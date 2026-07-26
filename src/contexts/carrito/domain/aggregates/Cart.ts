import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { CartId } from '../value-objects/CartId';
import { CustomerId } from '../value-objects/CustomerId';
import { Quantity } from '../value-objects/Quantity';
import { CartItemId } from '../value-objects/CartItemId';
import { CartItem } from '../entities/CartItem';
import { Money } from '../../../../shared-kernel/domain/base/Money';
import { CartItemAddedEvent } from '../events/CartItemAddedEvent';
import { CartItemRemovedEvent } from '../events/CartItemRemovedEvent';
import { CartAbandonedEvent } from '../events/CartAbandonedEvent';

export interface CartProps {
  id: CartId;
  customerId: CustomerId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export class Cart extends AggregateRoot<string> {
  private constructor(
    public readonly id: CartId,
    public readonly customerId: CustomerId,
    private _items: CartItem[],
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get items(): CartItem[] { return [...this._items]; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  get itemCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity.value, 0);
  }

  get totalAmount(): Money {
    return this._items.reduce(
      (total, item) => total.add(item.totalPrice),
      Money.fromNumber(0),
    );
  }

  static create(customerId: CustomerId): Cart {
    const now = new Date();
    return new Cart(
      CartId.generate(),
      customerId,
      [],
      now,
      now,
    );
  }

  static reconstitute(props: CartProps): Cart {
    return new Cart(
      props.id,
      props.customerId,
      props.items,
      props.createdAt,
      props.updatedAt,
    );
  }

  addItem(
    productId: string,
    quantity: Quantity,
    unitPrice: Money,
    correlationId?: string,
  ): void {
    const existingItem = this._items.find((i) => i.productId === productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity.increment(quantity.value);
      existingItem.updateQuantity(newQuantity);
    } else {
      const item = CartItem.create({
        id: CartItemId.generate(),
        productId,
        quantity,
        unitPrice,
        createdAt: new Date(),
      });
      this._items.push(item);
    }
    this._updatedAt = new Date();
    this.addDomainEvent(
      new CartItemAddedEvent(
        this.id.toString(),
        productId,
        quantity.value,
        unitPrice.amount,
        correlationId,
      ),
    );
  }

  removeItem(productId: string, correlationId?: string): void {
    const index = this._items.findIndex((i) => i.productId === productId);
    if (index === -1) {
      throw new Error(`Product ${productId} not found in cart`);
    }
    this._items.splice(index, 1);
    this._updatedAt = new Date();
    this.addDomainEvent(
      new CartItemRemovedEvent(this.id.toString(), productId, correlationId),
    );
  }

  updateItemQuantity(productId: string, quantity: Quantity): void {
    const item = this._items.find((i) => i.productId === productId);
    if (!item) {
      throw new Error(`Product ${productId} not found in cart`);
    }
    item.updateQuantity(quantity);
    this._updatedAt = new Date();
  }

  clear(correlationId?: string): void {
    const itemCount = this.itemCount;
    this._items = [];
    this._updatedAt = new Date();
    if (itemCount > 0) {
      this.addDomainEvent(
        new CartAbandonedEvent(
          this.id.toString(),
          this.customerId.toString(),
          itemCount,
          correlationId,
        ),
      );
    }
  }

  equals(other: AggregateRoot<string>): boolean {
    return other instanceof Cart && this.id.equals(other.id);
  }
}
