import { Component, OnInit, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, errorMessage } from '../core/api.service';
import { EventPage, EventFilters, Meta } from '../core/models';
import { EventCard } from './event-card';

@Component({
  selector: 'app-event-list',
  imports: [FormsModule, TitleCasePipe, EventCard],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly meta = signal<Meta>({ categories: [], cities: [] });
  protected readonly result = signal<EventPage | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly query = signal('');
  protected readonly category = signal('');
  protected readonly city = signal('');
  protected readonly page = signal(1);

  ngOnInit() {
    this.api.meta().subscribe((meta) => this.meta.set(meta));
    this.load();
  }

  protected search() {
    this.page.set(1);
    this.load();
  }

  protected setCategory(value: string) {
    this.category.set(value);
    this.page.set(1);
    this.load();
  }

  protected setCity(value: string) {
    this.city.set(value);
    this.page.set(1);
    this.load();
  }

  protected goToPage(page: number) {
    this.page.set(page);
    this.load();
  }

  protected hasFilters() {
    return !!(this.query() || this.category() || this.city());
  }

  protected clearFilters() {
    this.query.set('');
    this.category.set('');
    this.city.set('');
    this.page.set(1);
  }

  private filters(): EventFilters {
    return { q: this.query().trim(), category: this.category(), city: this.city(), page: this.page() };
  }

  private load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.listEvents(this.filters()).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err, 'We could not load events right now.'));
        this.loading.set(false);
      },
    });
  }
}
