export const MAX_GUESTS = 5;

export function discountFor(promo, subtotal) {
  if (!promo) return 0;
  const raw = promo.kind === 'percent' ? Math.round((subtotal * promo.amount) / 100) : promo.amount;
  return Math.min(raw, subtotal);
}

export function priceOrder(unitPrice, quantity, promo = null) {
  const subtotal = unitPrice * quantity;
  const discount = discountFor(promo, subtotal);
  return { subtotal, discount, total: subtotal - discount };
}
