import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { OrganiserEvent } from '../core/models';
import { NairaPipe } from '../shared/naira.pipe';

@Component({
  selector: 'app-organiser-dashboard',
  imports: [DatePipe, RouterLink, NairaPipe],
  template: `
    <h1>Organiser</h1>
    <p class="muted">Attendance and sales for every event on Gatepass.</p>
    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Date</th>
          <th>Tickets</th>
          <th>Checked in</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr>
            <td><a [routerLink]="['/organiser/events', row.id]">{{ row.title }}</a></td>
            <td>{{ row.startsAt | date: 'd MMM y' }}</td>
            <td>{{ row.ticketCount }} ({{ row.headcount }} people)</td>
            <td>{{ row.checkedIn }} / {{ row.headcount }}</td>
            <td>{{ row.revenue | naira }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class OrganiserDashboard implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly rows = signal<OrganiserEvent[]>([]);

  ngOnInit() {
    this.api.organiserEvents().subscribe((rows) => this.rows.set(rows));
  }
}
