import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventSummary } from '../core/models';
import { NairaPipe } from '../shared/naira.pipe';
import { fromPrice } from '../shared/pricing';

@Component({
  selector: 'app-event-card',
  imports: [RouterLink, DatePipe, NairaPipe],
  template: `
    <a class="card event-card" [routerLink]="['/events', event().id]" [attr.data-event-id]="event().id">
      <div class="meta">
        <span class="chip">{{ event().category }}</span>
        <span class="muted">{{ event().city }}</span>
      </div>
      <h3>{{ event().title }}</h3>
      <p class="muted when">{{ event().startsAt | date: 'EEE d MMM, h:mm a' }}</p>
      <p class="muted venue">{{ event().venue }}</p>
      <p class="price">
        @if (soldOut()) {
          <span class="error">Sold out</span>
        } @else if (lowestPrice() === 0) {
          Free
        } @else {
          From {{ lowestPrice() | naira }}
        }
      </p>
    </a>
  `,
  styles: `
    .event-card {
      display: grid;
      gap: 0.35rem;
      color: inherit;
      transition: box-shadow 0.15s ease;
    }
    .event-card:hover {
      box-shadow: 0 6px 20px rgba(31, 29, 71, 0.08);
    }
    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }
    h3 {
      margin: 0.25rem 0 0;
    }
    p {
      margin: 0;
    }
    .price {
      margin-top: 0.5rem;
      font-weight: 700;
    }
  `,
})
export class EventCard {
  readonly event = input.required<EventSummary>();

  protected readonly lowestPrice = computed(() => fromPrice(this.event().tiers));
  protected readonly soldOut = computed(() => this.event().tiers.every((t) => t.remaining === 0));
}
