import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { PromotionId } from '../value-objects/PromotionId';
import { PromotionCode } from '../value-objects/PromotionCode';
import { DiscountType } from '../value-objects/DiscountType';
import { DiscountValue } from '../value-objects/DiscountValue';
import { Money } from '../../../../shared-kernel/domain/base/Money';
import { PromotionAppliedEvent } from '../events/PromotionAppliedEvent';
import { PromotionExpiredEvent } from '../events/PromotionExpiredEvent';

export interface PromotionProps {
  id: PromotionId;
  code: PromotionCode;
  description: string;
  discountType: DiscountType;
  discountValue: DiscountValue;
  minPurchaseAmount: Money;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Promotion extends AggregateRoot<string> {
  private constructor(
    public readonly id: PromotionId,
    public readonly _code: PromotionCode,
    private _description: string,
    public readonly _discountType: DiscountType,
    public readonly _discountValue: DiscountValue,
    private _minPurchaseAmount: Money,
    private _startDate: Date,
    private _endDate: Date,
    private _isActive: boolean,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get code(): PromotionCode {
    return this._code;
  }
  get description(): string {
    return this._description;
  }
  get discountType(): DiscountType {
    return this._discountType;
  }
  get discountValue(): DiscountValue {
    return this._discountValue;
  }
  get minPurchaseAmount(): Money {
    return this._minPurchaseAmount;
  }
  get startDate(): Date {
    return this._startDate;
  }
  get endDate(): Date {
    return this._endDate;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(props: {
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minPurchaseAmount?: number;
    startDate: Date;
    endDate: Date;
  }): Promotion {
    const discountType = DiscountType.fromString(props.discountType);
    const discountValue = DiscountValue.fromNumber(
      props.discountValue,
      discountType,
    );

    if (props.startDate >= props.endDate) {
      throw new Error('Start date must be before end date');
    }

    return new Promotion(
      PromotionId.generate(),
      PromotionCode.fromString(props.code),
      props.description,
      discountType,
      discountValue,
      Money.fromNumber(props.minPurchaseAmount ?? 0),
      props.startDate,
      props.endDate,
      true,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(props: PromotionProps): Promotion {
    return new Promotion(
      props.id,
      props.code,
      props.description,
      props.discountType,
      props.discountValue,
      props.minPurchaseAmount,
      props.startDate,
      props.endDate,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  validate(purchaseAmount: number): boolean {
    if (!this._isActive) return false;
    const now = new Date();
    if (now < this._startDate || now > this._endDate) return false;
    if (purchaseAmount < this._minPurchaseAmount.amount) return false;
    return true;
  }

  applyDiscount(
    originalAmount: number,
    correlationId?: string,
  ): { finalAmount: number; discountAmount: number } {
    if (!this.validate(originalAmount)) {
      throw new Error(`Promotion ${this._code.toString()} is not applicable`);
    }
    const finalAmount = this._discountValue.applyDiscount(
      originalAmount,
      this._discountType,
    );
    const discountAmount =
      Math.round((originalAmount - finalAmount) * 100) / 100;

    this.addDomainEvent(
      new PromotionAppliedEvent(
        this.id.toString(),
        this._code.toString(),
        originalAmount,
        discountAmount,
        finalAmount,
        correlationId,
      ),
    );

    return { finalAmount, discountAmount };
  }

  deactivate(correlationId?: string): void {
    if (!this._isActive) {
      throw new Error(`Promotion ${this._code.toString()} is already inactive`);
    }
    this._isActive = false;
    this._updatedAt = new Date();
    this.addDomainEvent(
      new PromotionExpiredEvent(
        this.id.toString(),
        this._code.toString(),
        correlationId,
      ),
    );
  }

  isCurrentlyValid(): boolean {
    const now = new Date();
    return this._isActive && now >= this._startDate && now <= this._endDate;
  }

  equals(other: AggregateRoot<string>): boolean {
    return other instanceof Promotion && this.id.equals(other.id);
  }
}
