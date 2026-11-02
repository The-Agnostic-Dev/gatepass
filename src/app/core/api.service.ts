import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AttendeeList,
  EventDetail,
  EventFilters,
  EventPage,
  Meta,
  OrganiserEvent,
  Promo,
  RsvpRequest,
  Ticket,
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  meta() {
    return this.http.get<Meta>('/api/meta');
  }

  listEvents(filters: EventFilters) {
    let params = new HttpParams().set('page', filters.page);
    if (filters.q) params = params.set('q', filters.q);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.city) params = params.set('city', filters.city);
    return this.http.get<EventPage>('/api/events', { params });
  }

  getEvent(id: string) {
    return this.http.get<EventDetail>(`/api/events/${encodeURIComponent(id)}`);
  }

  checkPromo(code: string, eventId: string) {
    return this.http.post<Promo>('/api/promos/check', { code, eventId });
  }

  rsvp(eventId: string, request: RsvpRequest) {
    return this.http.post<Ticket>(`/api/events/${encodeURIComponent(eventId)}/rsvp`, request);
  }

  myTickets(email: string) {
    return this.http.get<Ticket[]>('/api/tickets', { params: { email } });
  }

  updateGuests(ticketId: string, guests: number) {
    return this.http.patch<Ticket>(`/api/tickets/${ticketId}`, { guests });
  }

  cancelTicket(ticketId: string) {
    return this.http.delete<void>(`/api/tickets/${ticketId}`);
  }

  organiserEvents() {
    return this.http.get<OrganiserEvent[]>('/api/organiser/events');
  }

  attendees(eventId: string) {
    return this.http.get<AttendeeList>(`/api/organiser/events/${encodeURIComponent(eventId)}/attendees`);
  }

  checkIn(ticketId: string) {
    return this.http.post<Ticket>(`/api/tickets/${ticketId}/check-in`, {});
  }

  undoCheckIn(ticketId: string) {
    return this.http.delete<Ticket>(`/api/tickets/${ticketId}/check-in`);
  }
}

export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof HttpErrorResponse && typeof error.error?.message === 'string') {
    return error.error.message;
  }
  return fallback;
}
