import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the main navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = Array.from(fixture.nativeElement.querySelectorAll('nav a')).map((a) =>
      (a as HTMLElement).textContent?.trim(),
    );
    expect(links).toEqual(['Events', 'My tickets', 'Organiser']);
  });

  it('shows the demo attendee by default', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const name = fixture.nativeElement.querySelector('[data-testid="profile-name"]') as HTMLElement;
    expect(name.textContent).toContain('Ada Obi');
  });
});
