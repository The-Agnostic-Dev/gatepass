import { Promo } from '../core/models';
import { fromPrice, promoDiscount, summariseOrder } from './pricing';

const tenPercent: Promo = { code: 'GATEPASS10', kind: 'percent', amount: 10, description: '' };
const twoThousandOff: Promo = { code: 'NAIJA2K', kind: 'fixed', amount: 2000, description: '' };

describe('summariseOrder', () => {
  it('charges the attendee plus every guest', () => {
    expect(summariseOrder(5000, 2, null)).toEqual({ quantity: 3, subtotal: 15000, discount: 0, total: 15000 });
  });

  it('applies a percentage promo to the whole order', () => {
    expect(summariseOrder(8000, 1, tenPercent)).toEqual({ quantity: 2, subtotal: 16000, discount: 1600, total: 14400 });
  });

  it('applies a fixed promo once per order', () => {
    expect(summariseOrder(3000, 0, twoThousandOff).total).toBe(1000);
  });
});

describe('promoDiscount', () => {
  it('never discounts more than the order is worth', () => {
    expect(promoDiscount(twoThousandOff, 1500)).toBe(1500);
  });

  it('is zero without a promo', () => {
    expect(promoDiscount(null, 9000)).toBe(0);
  });
});

describe('fromPrice', () => {
  it('returns null for an event without tiers', () => {
    expect(fromPrice([])).toBeNull();
  });

  it('returns the only price for a single tier event', () => {
    expect(fromPrice([{ id: 'a', name: 'Entry', price: 4000, remaining: 10 }])).toBe(4000);
  });
});
