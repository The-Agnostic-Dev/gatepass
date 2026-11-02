import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventSummary } from '../core/models';
import { EventCard } from './event-card';

const devfest: EventSummary = {
  id: 'devfest-lagos',
  title: 'DevFest Lagos',
  category: 'tech',
  city: 'Lagos',
  venue: 'Landmark Event Centre',
  startsAt: '2026-11-21T08:00:00.000Z',
  organiser: 'GDG Lagos',
  tiers: [{ id: 'c', name: 'Community', price: 0, remaining: 100 }],
};

describe('EventCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EventCard], providers: [provideRouter([])] });
  });

  function render(event: EventSummary) {
    const fixture = TestBed.createComponent(EventCard);
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('links to the event page', () => {
    const el = render(devfest);
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/events/devfest-lagos');
    expect(el.textContent).toContain('DevFest Lagos');
  });

  it('labels free events', () => {
    expect(render(devfest).querySelector('.price')?.textContent?.trim()).toBe('Free');
  });

  it('shows sold out when no tier has tickets left', () => {
    const el = render({ ...devfest, tiers: [{ ...devfest.tiers[0], remaining: 0 }] });
    expect(el.querySelector('.price')?.textContent).toContain('Sold out');
  });
});
