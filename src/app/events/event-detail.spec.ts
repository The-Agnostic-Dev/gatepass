import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EventDetailPage } from './event-detail';
import { ApiService } from '../core/api.service';
import { EventDetail } from '../core/models';

describe('EventDetailPage', () => {
  const detail: EventDetail = {
    id: 'afrobeats-in-the-park',
    title: 'Afrobeats in the Park',
    category: 'music',
    city: 'Lagos',
    venue: 'Muri Okunola Park, Victoria Island',
    startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    organiser: 'Sound Republic',
    description: 'An afternoon-into-night open air concert.',
    tiers: [
      { id: 'aitp-regular', name: 'Regular', price: 5000, capacity: 300, sold: 130, remaining: 170 },
      { id: 'aitp-vip', name: 'VIP', price: 25000, capacity: 50, sold: 50, remaining: 0 },
    ],
  };

  const afterBooking: EventDetail = {
    ...detail,
    tiers: [
      { id: 'aitp-regular', name: 'Regular', price: 5000, capacity: 300, sold: 131, remaining: 169 },
      { id: 'aitp-vip', name: 'VIP', price: 25000, capacity: 50, sold: 50, remaining: 0 },
    ],
  };

  let getEventCalls = 0;

  beforeEach(async () => {
    getEventCalls = 0;
    await TestBed.configureTestingModule({
      imports: [EventDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ApiService,
          useValue: {
            getEvent: () => of(++getEventCalls > 1 ? afterBooking : detail),
            rsvp: () =>
              of({
                id: 'ticket-1',
                ref: 'GP-TEST1',
                eventId: detail.id,
                tierId: 'aitp-regular',
                tierName: 'Regular',
                name: 'Test Guest',
                email: 'guest@example.com',
                guests: 0,
                quantity: 1,
                unitPrice: 5000,
                promoCode: null,
                subtotal: 5000,
                discount: 0,
                total: 5000,
                createdAt: new Date().toISOString(),
                checkedInAt: null,
                event: null,
              }),
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('shows the remaining ticket count for each tier, not the total capacity', async () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.componentRef.setInput('id', 'afrobeats-in-the-park');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('170 left');
    expect(text).not.toContain('300 left');
  });

  it('shows a sold-out indicator when a tier has no tickets remaining', async () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.componentRef.setInput('id', 'afrobeats-in-the-park');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sold out');
    expect(text).not.toContain('50 left');
  });

  it('shows one fewer ticket left after a purchase', async () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.componentRef.setInput('id', 'afrobeats-in-the-park');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;
    expect(page.textContent).toContain('170 left');

    const tierButton = Array.from(page.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Regular'),
    );
    if (!tierButton) throw new Error('Regular tier button not found');
    tierButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nameInput = page.querySelector<HTMLInputElement>('input[name="name"]');
    const emailInput = page.querySelector<HTMLInputElement>('input[name="email"]');
    if (!nameInput || !emailInput) throw new Error('Booking form inputs not found');
    nameInput.value = 'Test Guest';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.value = 'guest@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const form = page.querySelector('form');
    if (!form) throw new Error('Booking form not found');
    const submitButton = Array.from(form.querySelectorAll('button')).find(
      (button) => button.type === 'submit',
    );
    if (!submitButton) throw new Error('Submit button not found');
    submitButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = page.textContent;
    expect(text).toContain('169 left');
    expect(text).not.toContain('170 left');
  });
});
