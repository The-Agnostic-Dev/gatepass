import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, errorMessage } from '../core/api.service';
import { AttendeeList, Ticket } from '../core/models';

@Component({
  selector: 'app-attendee-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './attendee-list.html',
  styleUrl: './attendee-list.css',
})
export class AttendeeListPage {
  private readonly api = inject(ApiService);

  readonly id = input.required<string>();

  protected readonly data = signal<AttendeeList | null>(null);
  protected readonly attendees = signal<Ticket[]>([]);
  protected readonly search = signal('');
  protected readonly error = signal<string | null>(null);

  protected readonly visible = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.attendees();
    return this.attendees().filter((a) =>
      [a.name, a.email, a.ref].some((value) => value.toLowerCase().includes(term)),
    );
  });

  protected readonly headcount = computed(() => this.attendees().reduce((sum, a) => sum + a.quantity, 0));
  protected readonly checkedIn = computed(() =>
    this.attendees()
      .filter((a) => a.checkedInAt)
      .reduce((sum, a) => sum + a.quantity, 0),
  );

  constructor() {
    effect(() => {
      this.api.attendees(this.id()).subscribe({
        next: (data) => {
          this.data.set(data);
          this.attendees.set(data.attendees);
        },
        error: (err) => this.error.set(errorMessage(err, 'We could not load the guest list.')),
      });
    });
  }

  protected checkIn(index: number) {
    const attendee = this.attendees()[index];
    this.api.checkIn(attendee.id).subscribe({
      next: (updated) => this.replace(updated),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  protected undo(attendee: Ticket) {
    this.api.undoCheckIn(attendee.id).subscribe({
      next: (updated) => this.replace(updated),
      error: (err) => this.error.set(errorMessage(err)),
    });
  }

  private replace(updated: Ticket) {
    this.attendees.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
  }
}
