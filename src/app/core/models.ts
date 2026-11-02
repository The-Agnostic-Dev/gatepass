export interface TierSummary {
  id: string;
  name: string;
  price: number;
  remaining: number;
}

export interface Tier extends TierSummary {
  capacity: number;
  sold: number;
}

export interface EventSummary {
  id: string;
  title: string;
  category: string;
  city: string;
  venue: string;
  startsAt: string;
  organiser: string;
  tiers: TierSummary[];
}

export interface EventDetail extends EventSummary {
  description: string;
  tiers: Tier[];
}

export interface EventPage {
  items: EventSummary[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface EventFilters {
  q: string;
  category: string;
  city: string;
  page: number;
}

export interface Meta {
  categories: string[];
  cities: string[];
}

export interface Promo {
  code: string;
  kind: 'percent' | 'fixed';
  amount: number;
  description: string;
}

export interface RsvpRequest {
  tierId: string;
  name: string;
  email: string;
  guests: number;
  promoCode?: string;
}

export interface Ticket {
  id: string;
  ref: string;
  eventId: string;
  tierId: string;
  tierName: string;
  name: string;
  email: string;
  guests: number;
  quantity: number;
  unitPrice: number;
  promoCode: string | null;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  checkedInAt: string | null;
  event: { id: string; title: string; startsAt: string; venue: string; city: string } | null;
}

export interface OrganiserEvent {
  id: string;
  title: string;
  startsAt: string;
  city: string;
  ticketCount: number;
  headcount: number;
  checkedIn: number;
  revenue: number;
}

export interface AttendeeList {
  event: { id: string; title: string; startsAt: string };
  attendees: Ticket[];
}
