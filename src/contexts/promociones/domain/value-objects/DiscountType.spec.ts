import { DiscountType, DiscountTypeEnum } from './DiscountType';

describe('DiscountType Value Object', () => {
  it('should create PERCENTAGE type', () => {
    const dt = DiscountType.percentage();
    expect(dt.value).toBe(DiscountTypeEnum.PERCENTAGE);
    expect(dt.isPercentage).toBe(true);
    expect(dt.isFixedAmount).toBe(false);
  });

  it('should create FIXED_AMOUNT type', () => {
    const dt = DiscountType.fixedAmount();
    expect(dt.value).toBe(DiscountTypeEnum.FIXED_AMOUNT);
    expect(dt.isFixedAmount).toBe(true);
    expect(dt.isPercentage).toBe(false);
  });

  it('should create from valid string', () => {
    const dt = DiscountType.fromString('PERCENTAGE');
    expect(dt.value).toBe(DiscountTypeEnum.PERCENTAGE);
  });

  it('should throw on invalid string', () => {
    expect(() => DiscountType.fromString('INVALID')).toThrow(
      'Invalid DiscountType',
    );
  });

  it('should implement equals', () => {
    const dt1 = DiscountType.percentage();
    const dt2 = DiscountType.percentage();
    const dt3 = DiscountType.fixedAmount();

    expect(dt1.equals(dt2)).toBe(true);
    expect(dt1.equals(dt3)).toBe(false);
  });

  it('should implement toString', () => {
    expect(DiscountType.percentage().toString()).toBe('PERCENTAGE');
    expect(DiscountType.fixedAmount().toString()).toBe('FIXED_AMOUNT');
  });
});
