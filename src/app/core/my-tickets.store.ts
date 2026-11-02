import { Injectable, inject, signal } from '@angular/core';
import { ApiService, errorMessage } from './api.service';
import { Ticket } from './models';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class MyTicketsStore {
  private readonly api = inject(ApiService);
  private readonly profile = inject(ProfileService);

  private readonly state = signal<Ticket[]>([]);
  private loadedFor: string | null = null;

  readonly tickets = this.state.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  load() {
    const email = this.profile.profile().email;
    if (this.loadedFor === email) return;

    this.loading.set(true);
    this.error.set(null);
    this.api.myTickets(email).subscribe({
      next: (tickets) => {
        this.state.set(tickets);
        this.loadedFor = email;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(errorMessage(err, 'We could not load your tickets.'));
        this.loading.set(false);
      },
    });
  }

  replace(ticket: Ticket) {
    this.state.update((list) => list.map((t) => (t.id === ticket.id ? ticket : t)));
  }

  remove(ticketId: string) {
    this.state.update((list) => list.filter((t) => t.id !== ticketId));
  }
}
