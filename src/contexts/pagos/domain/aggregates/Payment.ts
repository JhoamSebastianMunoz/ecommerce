import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';
import { PaymentId } from '../value-objects/PaymentId';
import { PaymentStatus } from '../value-objects/PaymentStatus';
import { PaymentMethod } from '../value-objects/PaymentMethod';
import { TransactionId } from '../value-objects/TransactionId';
import { PaymentInitiatedEvent } from '../events/PaymentInitiatedEvent';
import { PaymentAuthorizedEvent } from '../events/PaymentAuthorizedEvent';
import { PaymentCapturedEvent } from '../events/PaymentCapturedEvent';
import { PaymentFailedEvent } from '../events/PaymentFailedEvent';
import { PaymentRefundedEvent } from '../events/PaymentRefundedEvent';

export class PaymentStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentStateError';
  }
}

export class Payment extends AggregateRoot<string> {
  private _id: PaymentId;
  private _currentVersion: number;
  private _status: PaymentStatus | null;
  private _orderId: string;
  private _amount: number;
  private _paymentMethod: PaymentMethod | null;
  private _transactionId: TransactionId | null;
  private _idempotencyKey: string | null;
  private _failureReason: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: PaymentId) {
    super();
    this._id = id;
    this._currentVersion = 0;
    this._status = null;
    this._orderId = '';
    this._amount = 0;
    this._paymentMethod = null;
    this._transactionId = null;
    this._idempotencyKey = null;
    this._failureReason = null;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): PaymentId { return this._id; }
  get currentVersion(): number { return this._currentVersion; }
  get status(): PaymentStatus | null { return this._status; }
  get orderId(): string { return this._orderId; }
  get amount(): number { return this._amount; }
  get paymentMethod(): PaymentMethod | null { return this._paymentMethod; }
  get transactionId(): TransactionId | null { return this._transactionId; }
  get idempotencyKey(): string | null { return this._idempotencyKey; }
  get failureReason(): string | null { return this._failureReason; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  static create(props: {
    orderId: string;
    amount: number;
    paymentMethod: string;
    idempotencyKey?: string;
    correlationId?: string;
  }): Payment {
    const payment = new Payment(PaymentId.generate());
    const version = payment._currentVersion + 1;
    payment.addDomainEvent(
      new PaymentInitiatedEvent(
        payment._id.toString(),
        props.orderId,
        props.amount,
        props.paymentMethod,
        props.idempotencyKey,
        props.correlationId,
        version,
      ),
    );
    payment.applyEvent(payment.domainEvents[payment.domainEvents.length - 1]);
    return payment;
  }

  static fromEvents(events: DomainEvent[]): Payment | null {
    if (events.length === 0) return null;
    const payment = new Payment(PaymentId.fromString(events[0].aggregateId));
    const sorted = [...events].sort((a, b) => a.version - b.version);
    for (const event of sorted) {
      payment.applyEvent(event);
    }
    payment.clearDomainEvents();
    return payment;
  }

  private applyEvent(event: DomainEvent): void {
    this._currentVersion = event.version;
    if (event instanceof PaymentInitiatedEvent) {
      this._status = PaymentStatus.INITIATED;
      this._orderId = event.orderId;
      this._amount = event.amount;
      this._paymentMethod = PaymentMethod.fromString(event.paymentMethod);
      this._idempotencyKey = event.idempotencyKey ?? null;
      this._createdAt = event.occurredAt;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof PaymentAuthorizedEvent) {
      this._status = PaymentStatus.AUTHORIZED;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof PaymentCapturedEvent) {
      this._status = PaymentStatus.CAPTURED;
      this._transactionId = TransactionId.fromString(event.transactionId);
      this._updatedAt = event.occurredAt;
    } else if (event instanceof PaymentFailedEvent) {
      this._status = PaymentStatus.FAILED;
      this._failureReason = event.reason;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof PaymentRefundedEvent) {
      this._status = PaymentStatus.REFUNDED;
      this._updatedAt = event.occurredAt;
    }
  }

  authorize(correlationId?: string): void {
    if (this._status !== PaymentStatus.INITIATED) {
      throw new PaymentStateError(
        `Cannot authorize payment in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    const version = this._currentVersion + 1;
    const event = new PaymentAuthorizedEvent(
      this._id.toString(),
      this._orderId,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  capture(transactionId: string, correlationId?: string): void {
    if (this._status !== PaymentStatus.AUTHORIZED) {
      throw new PaymentStateError(
        `Cannot capture payment in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    const version = this._currentVersion + 1;
    const event = new PaymentCapturedEvent(
      this._id.toString(),
      this._orderId,
      transactionId,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  fail(reason: string, correlationId?: string): void {
    if (this._status === PaymentStatus.CAPTURED || this._status === PaymentStatus.REFUNDED) {
      throw new PaymentStateError(
        `Cannot fail payment in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    const version = this._currentVersion + 1;
    const event = new PaymentFailedEvent(
      this._id.toString(),
      this._orderId,
      reason,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  refund(correlationId?: string): void {
    if (this._status !== PaymentStatus.CAPTURED) {
      throw new PaymentStateError(
        `Cannot refund payment in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    const version = this._currentVersion + 1;
    const event = new PaymentRefundedEvent(
      this._id.toString(),
      this._orderId,
      this._transactionId!.toString(),
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  equals(other: AggregateRoot<string>): boolean {
    return other instanceof Payment && this._id.equals(other._id);
  }
}
