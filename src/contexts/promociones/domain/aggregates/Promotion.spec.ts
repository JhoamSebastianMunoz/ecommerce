import { Promotion } from '../aggregates/Promotion';
import { PromotionId } from '../value-objects/PromotionId';
import { PromotionCode } from '../value-objects/PromotionCode';
import { DiscountType } from '../value-objects/DiscountType';
import { DiscountValue } from '../value-objects/DiscountValue';
import { Money } from '../../../../shared-kernel/domain/base/Money';

describe('Promotion Aggregate', () => {
  const futureStart = new Date(Date.now() + 86400000);
  const futureEnd = new Date(Date.now() + 86400000 * 30);

  describe('create', () => {
    it('should create a promotion with valid data', () => {
      const promotion = Promotion.create({
        code: 'SUMMER2026',
        description: 'Summer discount',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minPurchaseAmount: 50,
        startDate: futureStart,
        endDate: futureEnd,
      });

      expect(promotion.id).toBeInstanceOf(PromotionId);
      expect(promotion.code.toString()).toBe('SUMMER2026');
      expect(promotion.description).toBe('Summer discount');
      expect(promotion.discountType.isPercentage).toBe(true);
      expect(promotion.discountValue.value).toBe(15);
      expect(promotion.minPurchaseAmount.amount).toBe(50);
      expect(promotion.isActive).toBe(true);
    });

    it('should create a FIXED_AMOUNT promotion', () => {
      const promotion = Promotion.create({
        code: 'FLAT10',
        description: 'Flat $10 off',
        discountType: 'FIXED_AMOUNT',
        discountValue: 10,
        minPurchaseAmount: 30,
        startDate: futureStart,
        endDate: futureEnd,
      });

      expect(promotion.discountType.isFixedAmount).toBe(true);
      expect(promotion.discountValue.value).toBe(10);
    });

    it('should throw when start date is after end date', () => {
      expect(() =>
        Promotion.create({
          code: 'BAD',
          description: 'Bad dates',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          startDate: futureEnd,
          endDate: futureStart,
        }),
      ).toThrow('Start date must be before end date');
    });

    it('should throw when percentage exceeds 100', () => {
      expect(() =>
        Promotion.create({
          code: 'BAD',
          description: 'Bad discount',
          discountType: 'PERCENTAGE',
          discountValue: 150,
          startDate: futureStart,
          endDate: futureEnd,
        }),
      ).toThrow('Percentage discount cannot exceed 100');
    });

    it('should default minPurchaseAmount to 0', () => {
      const promotion = Promotion.create({
        code: 'NOMIN',
        description: 'No minimum',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        startDate: futureStart,
        endDate: futureEnd,
      });

      expect(promotion.minPurchaseAmount.amount).toBe(0);
    });
  });

  describe('validate', () => {
    it('should return true when promotion is active and within date range', () => {
      const promotion = Promotion.create({
        code: 'VALID',
        description: 'Valid promo',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 50,
        startDate: futureStart,
        endDate: futureEnd,
      });

      expect(promotion.validate(100)).toBe(true);
    });

    it('should return false when purchase amount is below minimum', () => {
      const promotion = Promotion.create({
        code: 'MIN50',
        description: 'Min 50',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 50,
        startDate: futureStart,
        endDate: futureEnd,
      });

      expect(promotion.validate(30)).toBe(false);
    });

    it('should return false when promotion is inactive', () => {
      const promotion = Promotion.create({
        code: 'INACTIVE',
        description: 'Inactive',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      promotion.deactivate();
      expect(promotion.validate(100)).toBe(false);
    });

    it('should return false when dates are in the past', () => {
      const pastStart = new Date(Date.now() - 86400000 * 10);
      const pastEnd = new Date(Date.now() - 86400000);
      const promotion = Promotion.create({
        code: 'PAST',
        description: 'Past dates',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: pastStart,
        endDate: pastEnd,
      });

      expect(promotion.validate(100)).toBe(false);
    });
  });

  describe('applyDiscount', () => {
    it('should apply percentage discount correctly', () => {
      const promotion = Promotion.create({
        code: 'PCT15',
        description: '15% off',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      const result = promotion.applyDiscount(100);
      expect(result.discountAmount).toBe(15);
      expect(result.finalAmount).toBe(85);
    });

    it('should apply fixed amount discount correctly', () => {
      const promotion = Promotion.create({
        code: 'FIX10',
        description: '$10 off',
        discountType: 'FIXED_AMOUNT',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      const result = promotion.applyDiscount(100);
      expect(result.discountAmount).toBe(10);
      expect(result.finalAmount).toBe(90);
    });

    it('should emit PromotionAppliedEvent', () => {
      const promotion = Promotion.create({
        code: 'EVT',
        description: 'Event test',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      promotion.applyDiscount(50);
      expect(promotion.domainEvents).toHaveLength(1);
      expect(promotion.domainEvents[0].eventType).toBe('PromotionApplied');
    });

    it('should throw when promotion is not applicable', () => {
      const promotion = Promotion.create({
        code: 'FAIL',
        description: 'Fail test',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 100,
        startDate: futureStart,
        endDate: futureEnd,
      });

      expect(() => promotion.applyDiscount(50)).toThrow('is not applicable');
    });

    it('should floor fixed discount to 0 when amount is less than discount', () => {
      const promotion = Promotion.create({
        code: 'BIG',
        description: 'Big discount',
        discountType: 'FIXED_AMOUNT',
        discountValue: 50,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      const result = promotion.applyDiscount(30);
      expect(result.finalAmount).toBe(0);
      expect(result.discountAmount).toBe(30);
    });
  });

  describe('deactivate', () => {
    it('should deactivate an active promotion', () => {
      const promotion = Promotion.create({
        code: 'ACT',
        description: 'Active',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      promotion.deactivate();
      expect(promotion.isActive).toBe(false);
    });

    it('should emit PromotionExpiredEvent', () => {
      const promotion = Promotion.create({
        code: 'EVT2',
        description: 'Event test',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      promotion.deactivate();
      expect(promotion.domainEvents).toHaveLength(1);
      expect(promotion.domainEvents[0].eventType).toBe('PromotionExpired');
    });

    it('should throw when already inactive', () => {
      const promotion = Promotion.create({
        code: 'INACT',
        description: 'Already inactive',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minPurchaseAmount: 0,
        startDate: futureStart,
        endDate: futureEnd,
      });

      promotion.deactivate();
      expect(() => promotion.deactivate()).toThrow('already inactive');
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute from props', () => {
      const promotion = Promotion.reconstitute({
        id: PromotionId.generate(),
        code: PromotionCode.fromString('RECON'),
        description: 'Reconstituted',
        discountType: DiscountType.percentage(),
        discountValue: DiscountValue.fromNumber(20, DiscountType.percentage()),
        minPurchaseAmount: Money.fromNumber(25),
        startDate: futureStart,
        endDate: futureEnd,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(promotion.code.toString()).toBe('RECON');
      expect(promotion.description).toBe('Reconstituted');
    });
  });

  describe('equals', () => {
    it('should return true for same promotion id', () => {
      const id = PromotionId.generate();
      const p1 = Promotion.reconstitute({
        id,
        code: PromotionCode.fromString('EQ1'),
        description: '',
        discountType: DiscountType.percentage(),
        discountValue: DiscountValue.fromNumber(10, DiscountType.percentage()),
        minPurchaseAmount: Money.fromNumber(0),
        startDate: futureStart,
        endDate: futureEnd,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const p2 = Promotion.reconstitute({
        id,
        code: PromotionCode.fromString('EQ2'),
        description: '',
        discountType: DiscountType.percentage(),
        discountValue: DiscountValue.fromNumber(10, DiscountType.percentage()),
        minPurchaseAmount: Money.fromNumber(0),
        startDate: futureStart,
        endDate: futureEnd,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(p1.equals(p2)).toBe(true);
    });
  });
});
