import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../core/api.service';
import { ProfileService } from '../core/profile.service';
import { EventDetailPage } from './event-detail';

describe('EventDetailPage remaining ticket counts', () => {
  let fixture: ComponentFixture<EventDetailPage>;
  let booked: number;

  const afrobeats = () => ({
    id: 'afrobeats-in-the-park',
    title: 'Afrobeats in the Park',
    category: 'music',
    city: 'Lagos',
    venue: 'Muri Okunola Park, Victoria Island',
    startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    organiser: 'Sound Republic',
    description:
      'An afternoon-into-night open air concert with six live acts, food trucks and a silent disco tent.',
    tiers: [
      {
        id: 'aitp-regular',
        name: 'Regular',
        price: 5000,
        capacity: 300,
        sold: 129 + booked,
        remaining: 171 - booked,
      },
      {
        id: 'aitp-vip',
        name: 'VIP',
        price: 25000,
        capacity: 50,
        sold: 18,
        remaining: 32,
      },
    ],
  });

  const ticket = {
    id: 'ticket-1',
    reference: 'GP-TEST-1',
    eventId: 'afrobeats-in-the-park',
    tierId: 'aitp-regular',
    tierName: 'Regular',
    quantity: 1,
    guests: 0,
    name: 'Chidi Test',
    email: 'chidi@example.com',
    price: 5000,
    total: 5000,
  };

  beforeEach(async () => {
    booked = 0;

    const apiStub = new Proxy(
      { getEvent: () => of(afrobeats()) },
      {
        get(target: Record<string, unknown>, prop: string | symbol) {
          if (typeof prop === 'string' && prop in target) {
            return target[prop];
          }
          if (typeof prop !== 'string' || prop.startsWith('__')) {
            return undefined;
          }
          return () => {
            booked += 1;
            return of(ticket);
          };
        },
      },
    );

    const profileStub = {
      profile: () => ({ name: '', email: '' }),
    };

    await TestBed.configureTestingModule({
      imports: [EventDetailPage],
      providers: [
        { provide: ApiService, useValue: apiStub },
        { provide: ProfileService, useValue: profileStub },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailPage);
    fixture.componentRef.setInput('id', 'afrobeats-in-the-park');
  });

  it('shows the real remaining count for each tier, not the total capacity', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('171 left');
    expect(text).toContain('32 left');
    expect(text).not.toContain('300 left');
    expect(text).not.toContain('50 left');
  });

  it('drops the remaining count for the booked tier after a purchase', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('171 left');

    const comp = fixture.componentInstance as unknown as Record<string, any>;
    comp['tierId'].set('aitp-regular');
    comp['guests'].set(0);
    comp['name'].set('Chidi Test');
    comp['email'].set('chidi@example.com');

    comp['submit']();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('170 left');
    expect(text).toContain('32 left');
  });
});
