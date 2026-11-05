// @vitest-environment jsdom
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { EventDetailPage } from './event-detail';
import { ApiService } from '../core/api.service';
import { ProfileService } from '../core/profile.service';
import { EventDetail } from '../core/models';

const event: EventDetail = {
  id: 'afrobeats-in-the-park',
  title: 'Afrobeats in the Park',
  category: 'music',
  city: 'Lagos',
  venue: 'Muri Okunola Park, Victoria Island',
  startsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  organiser: 'Sound Republic',
  description: 'An afternoon-into-night open air concert.',
  tiers: [
    { id: 'aitp-regular', name: 'Regular', price: 5000, capacity: 300, sold: 130, remaining: 170 },
    { id: 'aitp-vip', name: 'VIP', price: 25000, capacity: 50, sold: 50, remaining: 0 },
  ],
};

let environmentInitialised = false;

beforeAll(() => {
  if (environmentInitialised) return;
  try {
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    environmentInitialised = true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('already initialized')) return;
    throw error;
  }
});

describe('EventDetailPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailPage],
      providers: [
        {
          provide: ApiService,
          useValue: {
            getEvent: () => of(event),
          },
        },
        {
          provide: ProfileService,
          useValue: {
            profile: signal({ name: '', email: '' }),
          },
        },
      ],
    }).compileComponents();
  });

  it('shows the remaining ticket count for each tier, not the capacity', async () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.componentRef.setInput('id', 'afrobeats-in-the-park');
    await fixture.whenStable();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('170 left');
    expect(text).not.toContain('300 left');
  });

  it('shows Sold out for a tier with no tickets remaining', async () => {
    const fixture = TestBed.createComponent(EventDetailPage);
    fixture.componentRef.setInput('id', 'afrobeats-in-the-park');
    await fixture.whenStable();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Sold out');
    expect(text).not.toContain('50 left');
  });
});
