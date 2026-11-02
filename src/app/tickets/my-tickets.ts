import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, errorMessage } from '../core/api.service';
import { Ticket } from '../core/models';
import { MyTicketsStore } from '../core/my-tickets.store';
import { ProfileService } from '../core/profile.service';
import { NairaPipe } from '../shared/naira.pipe';

@Component({
  selector: 'app-my-tickets',
  imports: [DatePipe, FormsModule, RouterLink, NairaPipe],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css',
})
export class MyTickets implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly store = inject(MyTicketsStore);
  protected readonly profiles = inject(ProfileService);

  protected readonly editing = signal<string | null>(null);
  protected readonly draftGuests = signal(0);
  protected readonly message = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);
  protected readonly guestOptions = [0, 1, 2, 3, 4, 5];

  ngOnInit() {
    this.store.load();
  }

  protected startEdit(ticket: Ticket) {
    this.editing.set(ticket.id);
    this.draftGuests.set(ticket.guests);
    this.message.set(null);
    this.actionError.set(null);
  }

  protected saveGuests(ticket: Ticket) {
    this.api.updateGuests(ticket.id, this.draftGuests()).subscribe({
      next: (updated) => {
        this.store.replace(updated);
        this.editing.set(null);
        this.message.set(`Updated ${updated.ref}: admits ${updated.quantity}.`);
      },
      error: (err) => this.actionError.set(errorMessage(err)),
    });
  }

  protected cancel(ticket: Ticket) {
    if (!confirm(`Cancel ${ticket.ref} for ${ticket.event?.title}?`)) return;
    this.api.cancelTicket(ticket.id).subscribe({
      next: () => {
        this.store.remove(ticket.id);
        this.message.set(`${ticket.ref} has been cancelled.`);
      },
      error: (err) => this.actionError.set(errorMessage(err)),
    });
  }
}
