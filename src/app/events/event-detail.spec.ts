import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EventDetailPage } from './event-detail';
import { ApiService } from '../core/api.service';
import { EventDetail } from '../core/models';

beforeAll(() => {
  TestBed.initTestEnvironment(BrowserTestingModule);
});

afterAll(() => {
  TestBed.resetTestEnvironment();
});

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

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [EventDetailPage],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: { getEvent: () => of(detail) } },
      ],
    });
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
});
