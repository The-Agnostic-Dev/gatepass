import { Promo, TierSummary } from '../core/models';

export interface OrderSummary {
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
}

/** Cheapest ticket price for an event, shown as "From ..." on event cards. */
export function fromPrice(tiers: TierSummary[]): number | null {
  if (tiers.length === 0) return null;
  const prices = tiers.map((t) => t.price).sort();
  return prices[0];
}

export function promoDiscount(promo: Promo | null, subtotal: number): number {
  if (!promo) return 0;
  const raw = promo.kind === 'percent' ? Math.round((subtotal * promo.amount) / 100) : promo.amount;
  return Math.min(raw, subtotal);
}

export function summariseOrder(unitPrice: number, guests: number, promo: Promo | null): OrderSummary {
  const quantity = 1 + guests;
  const subtotal = unitPrice * quantity;
  const discount = promoDiscount(promo, subtotal);
  return { quantity, subtotal, discount, total: subtotal - discount };
}
