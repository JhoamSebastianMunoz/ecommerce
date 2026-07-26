import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  STOCK_RESERVED = 'STOCK_RESERVED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

const VALID_TRANSITIONS: Record<OrderStatusEnum, OrderStatusEnum[]> = {
  [OrderStatusEnum.PENDING]: [
    OrderStatusEnum.STOCK_RESERVED,
    OrderStatusEnum.FAILED,
    OrderStatusEnum.CANCELLED,
  ],
  [OrderStatusEnum.STOCK_RESERVED]: [
    OrderStatusEnum.PAYMENT_PENDING,
    OrderStatusEnum.FAILED,
    OrderStatusEnum.CANCELLED,
  ],
  [OrderStatusEnum.PAYMENT_PENDING]: [
    OrderStatusEnum.CONFIRMED,
    OrderStatusEnum.FAILED,
    OrderStatusEnum.CANCELLED,
  ],
  [OrderStatusEnum.CONFIRMED]: [],
  [OrderStatusEnum.FAILED]: [],
  [OrderStatusEnum.CANCELLED]: [],
};

export class OrderStatus extends ValueObject<string> {
  private constructor(public readonly value: OrderStatusEnum) {
    super();
  }

  static PENDING = new OrderStatus(OrderStatusEnum.PENDING);
  static STOCK_RESERVED = new OrderStatus(OrderStatusEnum.STOCK_RESERVED);
  static PAYMENT_PENDING = new OrderStatus(OrderStatusEnum.PAYMENT_PENDING);
  static CONFIRMED = new OrderStatus(OrderStatusEnum.CONFIRMED);
  static FAILED = new OrderStatus(OrderStatusEnum.FAILED);
  static CANCELLED = new OrderStatus(OrderStatusEnum.CANCELLED);

  static fromString(value: string): OrderStatus {
    switch (value) {
      case 'PENDING': return OrderStatus.PENDING;
      case 'STOCK_RESERVED': return OrderStatus.STOCK_RESERVED;
      case 'PAYMENT_PENDING': return OrderStatus.PAYMENT_PENDING;
      case 'CONFIRMED': return OrderStatus.CONFIRMED;
      case 'FAILED': return OrderStatus.FAILED;
      case 'CANCELLED': return OrderStatus.CANCELLED;
      default: throw new Error(`Invalid OrderStatus: ${value}`);
    }
  }

  canTransitionTo(target: OrderStatus): boolean {
    return VALID_TRANSITIONS[this.value].includes(target.value);
  }

  equals(other: ValueObject<string>): boolean {
    return other instanceof OrderStatus && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
