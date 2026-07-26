import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { OrderId } from '../value-objects/OrderId';
import { OrderStatus, OrderStatusEnum } from '../value-objects/OrderStatus';
import { ShippingAddress } from '../value-objects/ShippingAddress';
import { Money } from '../../../../shared-kernel/domain/base/Money';
import { OrderPlacedEvent } from '../events/OrderPlacedEvent';
import { StockReservedEvent } from '../events/StockReservedEvent';
import { OrderConfirmedEvent } from '../events/OrderConfirmedEvent';
import { OrderFailedEvent } from '../events/OrderFailedEvent';
import { OrderCancelledEvent } from '../events/OrderCancelledEvent';

export interface OrderItemProps {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
  ) {
    if (!productId) throw new Error('ProductId is required');
    if (quantity <= 0) throw new Error('Quantity must be positive');
    if (unitPrice < 0) throw new Error('Unit price must be non-negative');
  }

  get totalPrice(): number {
    return Math.round(this.quantity * this.unitPrice * 100) / 100;
  }
}

export interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: Money;
  discountAmount: Money;
  shippingAddress: ShippingAddress;
  idempotencyKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot<string> {
  private constructor(
    public readonly id: OrderId,
    public readonly customerId: string,
    private _status: OrderStatus,
    public readonly items: OrderItem[],
    private _totalAmount: Money,
    private _discountAmount: Money,
    public readonly shippingAddress: ShippingAddress,
    private _idempotencyKey?: string,
    private _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(),
  ) {
    super();
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalAmount(): Money {
    return this._totalAmount;
  }

  get discountAmount(): Money {
    return this._discountAmount;
  }

  get idempotencyKey(): string | undefined {
    return this._idempotencyKey;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(props: {
    customerId: string;
    items: OrderItemProps[];
    shippingAddress: { street: string; city: string };
    discountAmount?: number;
    idempotencyKey?: string;
  }): Order {
    if (!props.customerId) throw new Error('CustomerId is required');
    if (!props.items || props.items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    const orderItems = props.items.map((i) => new OrderItem(i.productId, i.quantity, i.unitPrice));
    const rawTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = Money.fromNumber(props.discountAmount ?? 0);
    const total = Money.fromNumber(rawTotal).subtract(discount);

    const shipping = ShippingAddress.create(
      props.shippingAddress.street,
      props.shippingAddress.city,
    );

    const order = new Order(
      OrderId.generate(),
      props.customerId,
      OrderStatus.PENDING,
      orderItems,
      total,
      discount,
      shipping,
      props.idempotencyKey,
    );

    order.addDomainEvent(
      new OrderPlacedEvent(
        order.id.toString(),
        order.customerId,
        total.amount,
        props.idempotencyKey,
      ),
    );

    return order;
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(
      props.id,
      props.customerId,
      props.status,
      props.items,
      props.totalAmount,
      props.discountAmount,
      props.shippingAddress,
      props.idempotencyKey,
      props.createdAt,
      props.updatedAt,
    );
  }

  private transitionTo(newStatus: OrderStatus): void {
    if (!this._status.canTransitionTo(newStatus)) {
      throw new Error(
        `Cannot transition from ${this._status.toString()} to ${newStatus.toString()}`,
      );
    }
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  markStockReserved(
    items: Array<{ productId: string; quantity: number }>,
    correlationId?: string,
  ): void {
    this.transitionTo(OrderStatus.STOCK_RESERVED);
    this.addDomainEvent(
      new StockReservedEvent(this.id.toString(), items, correlationId),
    );
  }

  markPaymentPending(correlationId?: string): void {
    this.transitionTo(OrderStatus.PAYMENT_PENDING);
  }

  confirm(
    paymentTransactionId: string,
    shipmentId: string,
    correlationId?: string,
  ): void {
    this.transitionTo(OrderStatus.CONFIRMED);
    this.addDomainEvent(
      new OrderConfirmedEvent(
        this.id.toString(),
        paymentTransactionId,
        shipmentId,
        correlationId,
      ),
    );
  }

  fail(reason: string, failedStep: string, correlationId?: string): void {
    if (this._status.value === OrderStatusEnum.CONFIRMED) {
      throw new Error('Cannot fail an already confirmed order');
    }
    this._status = OrderStatus.FAILED;
    this._updatedAt = new Date();
    this.addDomainEvent(
      new OrderFailedEvent(this.id.toString(), reason, failedStep, correlationId),
    );
  }

  cancel(reason?: string, correlationId?: string): void {
    if (this._status.value === OrderStatusEnum.CONFIRMED) {
      throw new Error('Cannot cancel an already confirmed order');
    }
    this.transitionTo(OrderStatus.CANCELLED);
    this.addDomainEvent(
      new OrderCancelledEvent(this.id.toString(), reason, correlationId),
    );
  }

  equals(other: AggregateRoot<string>): boolean {
    return other instanceof Order && this.id.equals(other.id);
  }
}
