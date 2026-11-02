import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, errorMessage } from '../core/api.service';
import { EventDetail, Promo, Ticket } from '../core/models';
import { ProfileService } from '../core/profile.service';
import { NairaPipe } from '../shared/naira.pipe';
import { summariseOrder } from '../shared/pricing';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe, FormsModule, RouterLink, NairaPipe],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailPage {
  private readonly api = inject(ApiService);
  private readonly profiles = inject(ProfileService);

  readonly id = input.required<string>();

  protected readonly event = signal<EventDetail | null>(null);
  protected readonly loadError = signal<string | null>(null);

  protected readonly tierId = signal('');
  protected readonly guests = signal(0);
  protected readonly name = signal(this.profiles.profile().name);
  protected readonly email = signal(this.profiles.profile().email);
  protected readonly promoInput = signal('');
  protected readonly promo = signal<Promo | null>(null);
  protected readonly promoError = signal<string | null>(null);

  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, string>>({});
  protected readonly booked = signal<Ticket | null>(null);

  protected readonly guestOptions = [0, 1, 2, 3, 4, 5];

  protected readonly selectedTier = computed(() => this.event()?.tiers.find((t) => t.id === this.tierId()) ?? null);
  protected readonly isPast = computed(() => {
    const event = this.event();
    return !!event && new Date(event.startsAt).getTime() < Date.now();
  });
  protected readonly order = computed(() => {
    const tier = this.selectedTier();
    return tier ? summariseOrder(tier.price, this.guests(), this.promo()) : null;
  });
  protected readonly canSubmit = computed(
    () => !!this.selectedTier() && this.name().trim().length > 1 && this.email().trim().length > 3,
  );

  constructor() {
    effect(() => this.load(this.id()));
  }

  private load(id: string) {
    this.event.set(null);
    this.booked.set(null);
    this.loadError.set(null);
    this.api.getEvent(id).subscribe({
      next: (event) => {
        this.event.set(event);
        const firstAvailable = event.tiers.find((t) => t.remaining > 0);
        this.tierId.set(firstAvailable?.id ?? '');
      },
      error: (err) => this.loadError.set(errorMessage(err, 'We could not load this event.')),
    });
  }

  protected chooseTier(tierId: string) {
    this.tierId.set(tierId);
  }

  protected applyPromo() {
    const code = this.promoInput().trim();
    const event = this.event();
    if (!code || !event) return;
    this.promoError.set(null);
    this.api.checkPromo(code, event.id).subscribe({
      next: (promo) => this.promo.set(promo),
      error: (err) => {
        this.promo.set(null);
        this.promoError.set(errorMessage(err, 'That code is not valid.'));
      },
    });
  }

  protected removePromo() {
    this.promo.set(null);
    this.promoInput.set('');
  }

  protected submit() {
    const event = this.event();
    if (!event || !this.canSubmit()) return;

    this.submitting.set(true);
    this.submitError.set(null);
    this.fieldErrors.set({});

    this.api
      .rsvp(event.id, {
        tierId: this.tierId(),
        name: this.name(),
        email: this.email(),
        guests: this.guests(),
        promoCode: this.promo()?.code,
      })
      .subscribe({
        next: (ticket) => {
          this.submitting.set(false);
          this.booked.set(ticket);
          this.api.getEvent(event.id).subscribe((fresh) => this.event.set(fresh));
        },
        error: (err) => {
          this.submitting.set(false);
          this.submitError.set(errorMessage(err, 'We could not complete your booking.'));
          this.fieldErrors.set(err?.error?.errors ?? {});
        },
      });
  }
}
