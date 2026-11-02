import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Upcoming events | Gatepass',
    loadComponent: () => import('./events/event-list').then((m) => m.EventList),
  },
  {
    path: 'events/:id',
    title: 'Event | Gatepass',
    loadComponent: () => import('./events/event-detail').then((m) => m.EventDetailPage),
  },
  {
    path: 'tickets',
    title: 'My tickets | Gatepass',
    loadComponent: () => import('./tickets/my-tickets').then((m) => m.MyTickets),
  },
  {
    path: 'organiser',
    title: 'Organiser | Gatepass',
    loadComponent: () => import('./organiser/organiser-dashboard').then((m) => m.OrganiserDashboard),
  },
  {
    path: 'organiser/events/:id',
    title: 'Attendees | Gatepass',
    loadComponent: () => import('./organiser/attendee-list').then((m) => m.AttendeeListPage),
  },
  { path: '**', redirectTo: '' },
];
