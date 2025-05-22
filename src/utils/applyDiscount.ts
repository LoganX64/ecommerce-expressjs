// utils/applyDiscount.ts
export interface DiscountInput {
  originalPrice: number;
  value: number;
  valueType: 'percentage' | 'fixed';
}

/**
 * Applies a discount to a given price based on type.
 * Throws an error if the result would be negative.
 */
export function applyDiscount({ originalPrice, value, valueType }: DiscountInput): number {
  if (originalPrice < 0) {
    throw new Error('Original price must be a non-negative number.');
  }

  if (value < 0) {
    throw new Error('Discount value must be a non-negative number.');
  }

  let discountedPrice: number;

  if (valueType === 'percentage') {
    const percentage = Math.min(value, 100);
    discountedPrice = originalPrice - originalPrice * (percentage / 100);
  } else if (valueType === 'fixed') {
    discountedPrice = originalPrice - value;
    if (discountedPrice < 0) {
      throw new Error(
        `Fixed discount of ${value} is too high. It exceeds the original price of ${originalPrice}.`
      );
    }
  } else {
    throw new Error('Invalid discount type. Must be "percentage" or "fixed".');
  }

  return parseFloat(discountedPrice.toFixed(2));
}
