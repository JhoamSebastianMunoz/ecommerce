import { DiscountType } from './DiscountType';
import { DiscountValue } from './DiscountValue';

describe('DiscountValue Value Object', () => {
  const percentageType = DiscountType.percentage();
  const fixedType = DiscountType.fixedAmount();

  it('should create valid percentage discount', () => {
    const dv = DiscountValue.fromNumber(15, percentageType);
    expect(dv.value).toBe(15);
  });

  it('should create valid fixed amount discount', () => {
    const dv = DiscountValue.fromNumber(10, fixedType);
    expect(dv.value).toBe(10);
  });

  it('should round to 2 decimals', () => {
    const dv = DiscountValue.fromNumber(15.555, percentageType);
    expect(dv.value).toBe(15.56);
  });

  it('should throw on zero', () => {
    expect(() => DiscountValue.fromNumber(0, percentageType)).toThrow(
      'positive finite number',
    );
  });

  it('should throw on negative', () => {
    expect(() => DiscountValue.fromNumber(-5, fixedType)).toThrow(
      'positive finite number',
    );
  });

  it('should throw on non-finite', () => {
    expect(() => DiscountValue.fromNumber(NaN, percentageType)).toThrow(
      'positive finite number',
    );
  });

  it('should throw when percentage exceeds 100', () => {
    expect(() => DiscountValue.fromNumber(150, percentageType)).toThrow(
      'cannot exceed 100',
    );
  });

  it('should allow fixed amount above 100', () => {
    const dv = DiscountValue.fromNumber(200, fixedType);
    expect(dv.value).toBe(200);
  });

  describe('applyDiscount', () => {
    it('should apply percentage discount', () => {
      const dv = DiscountValue.fromNumber(20, percentageType);
      expect(dv.applyDiscount(100, percentageType)).toBe(80);
    });

    it('should apply fixed amount discount', () => {
      const dv = DiscountValue.fromNumber(25, fixedType);
      expect(dv.applyDiscount(100, fixedType)).toBe(75);
    });

    it('should floor at 0 for fixed amount exceeding total', () => {
      const dv = DiscountValue.fromNumber(50, fixedType);
      expect(dv.applyDiscount(30, fixedType)).toBe(0);
    });

    it('should handle percentage 100%', () => {
      const dv = DiscountValue.fromNumber(100, percentageType);
      expect(dv.applyDiscount(200, percentageType)).toBe(0);
    });
  });

  it('should implement equals', () => {
    const dv1 = DiscountValue.fromNumber(15, percentageType);
    const dv2 = DiscountValue.fromNumber(15, percentageType);
    const dv3 = DiscountValue.fromNumber(20, percentageType);

    expect(dv1.equals(dv2)).toBe(true);
    expect(dv1.equals(dv3)).toBe(false);
  });

  it('should implement toString', () => {
    const dv = DiscountValue.fromNumber(15, percentageType);
    expect(dv.toString()).toBe('15.00');
  });
});
