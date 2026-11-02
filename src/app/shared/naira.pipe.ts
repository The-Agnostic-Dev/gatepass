import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number): string {
  return formatter.format(amount);
}

@Pipe({ name: 'naira' })
export class NairaPipe implements PipeTransform {
  transform(amount: number | null | undefined, freeLabel?: string): string {
    if (amount == null) return '';
    if (amount === 0 && freeLabel) return freeLabel;
    return formatNaira(amount);
  }
}
