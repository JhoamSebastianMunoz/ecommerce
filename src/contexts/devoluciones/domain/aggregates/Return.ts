import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { DomainEvent } from '../../../../shared-kernel/domain/base/DomainEvent';
import { ReturnId } from '../value-objects/ReturnId';
import { ReturnStatus } from '../value-objects/ReturnStatus';
import { ReturnRequestedEvent } from '../events/ReturnRequestedEvent';
import { ReturnApprovedEvent } from '../events/ReturnApprovedEvent';
import { ReturnRejectedEvent } from '../events/ReturnRejectedEvent';
import { ReturnReceivedEvent } from '../events/ReturnReceivedEvent';
import { RefundIssuedEvent } from '../events/RefundIssuedEvent';

export class ReturnStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReturnStateError';
  }
}

export interface ReturnItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class Return extends AggregateRoot<string> {
  private _id: ReturnId;
  private _currentVersion: number;
  private _status: ReturnStatus | null;
  private _orderId: string;
  private _reason: string;
  private _items: ReturnItem[];
  private _refundAmount: number | null;
  private _refundTransactionId: string | null;
  private _notes: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: ReturnId) {
    super();
    this._id = id;
    this._currentVersion = 0;
    this._status = null;
    this._orderId = '';
    this._reason = '';
    this._items = [];
    this._refundAmount = null;
    this._refundTransactionId = null;
    this._notes = null;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): ReturnId { return this._id; }
  get currentVersion(): number { return this._currentVersion; }
  get status(): ReturnStatus | null { return this._status; }
  get orderId(): string { return this._orderId; }
  get reason(): string { return this._reason; }
  get items(): ReturnItem[] { return this._items; }
  get refundAmount(): number | null { return this._refundAmount; }
  get refundTransactionId(): string | null { return this._refundTransactionId; }
  get notes(): string | null { return this._notes; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  static create(props: {
    orderId: string;
    reason: string;
    items: ReturnItem[];
    correlationId?: string;
  }): Return {
    const ret = new Return(ReturnId.generate());
    const version = ret._currentVersion + 1;
    ret.addDomainEvent(
      new ReturnRequestedEvent(
        ret._id.toString(),
        props.orderId,
        props.reason,
        props.items,
        props.correlationId,
        version,
      ),
    );
    ret.applyEvent(ret.domainEvents[ret.domainEvents.length - 1]);
    return ret;
  }

  static fromEvents(events: DomainEvent[]): Return | null {
    if (events.length === 0) return null;
    const ret = new Return(ReturnId.fromString(events[0].aggregateId));
    const sorted = [...events].sort((a, b) => a.version - b.version);
    for (const event of sorted) {
      ret.applyEvent(event);
    }
    ret.clearDomainEvents();
    return ret;
  }

  private applyEvent(event: DomainEvent): void {
    this._currentVersion = event.version;
    if (event instanceof ReturnRequestedEvent) {
      this._status = ReturnStatus.REQUESTED;
      this._orderId = event.orderId;
      this._reason = event.reason;
      this._items = event.items;
      this._createdAt = event.occurredAt;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof ReturnApprovedEvent) {
      this._status = ReturnStatus.APPROVED;
      this._refundAmount = event.refundAmount;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof ReturnRejectedEvent) {
      this._status = ReturnStatus.REJECTED;
      this._notes = event.reason;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof ReturnReceivedEvent) {
      this._status = ReturnStatus.RECEIVED;
      this._notes = event.notes ?? this._notes;
      this._updatedAt = event.occurredAt;
    } else if (event instanceof RefundIssuedEvent) {
      this._status = ReturnStatus.REFUND_ISSUED;
      this._refundTransactionId = event.transactionId;
      this._updatedAt = event.occurredAt;
    }
  }

  approve(refundAmount: number, correlationId?: string): void {
    if (this._status !== ReturnStatus.REQUESTED) {
      throw new ReturnStateError(
        `Cannot approve return in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    if (refundAmount <= 0) {
      throw new ReturnStateError('Refund amount must be positive');
    }
    const version = this._currentVersion + 1;
    const event = new ReturnApprovedEvent(
      this._id.toString(),
      this._orderId,
      refundAmount,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  reject(reason: string, correlationId?: string): void {
    if (this._status !== ReturnStatus.REQUESTED) {
      throw new ReturnStateError(
        `Cannot reject return in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    const version = this._currentVersion + 1;
    const event = new ReturnRejectedEvent(
      this._id.toString(),
      this._orderId,
      reason,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  receive(notes: string | null, correlationId?: string): void {
    if (this._status !== ReturnStatus.APPROVED) {
      throw new ReturnStateError(
        `Cannot receive return in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    const version = this._currentVersion + 1;
    const event = new ReturnReceivedEvent(
      this._id.toString(),
      this._orderId,
      notes,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  issueRefund(transactionId: string, correlationId?: string): void {
    if (this._status !== ReturnStatus.RECEIVED) {
      throw new ReturnStateError(
        `Cannot issue refund for return in status ${this._status?.toString() ?? 'UNKNOWN'}`,
      );
    }
    if (this._refundAmount === null) {
      throw new ReturnStateError('Cannot issue refund without approved refund amount');
    }
    const version = this._currentVersion + 1;
    const event = new RefundIssuedEvent(
      this._id.toString(),
      this._orderId,
      this._refundAmount,
      transactionId,
      correlationId,
      version,
    );
    this.addDomainEvent(event);
    this.applyEvent(event);
  }

  equals(other: AggregateRoot<string>): boolean {
    return other instanceof Return && this._id.equals(other._id);
  }
}
