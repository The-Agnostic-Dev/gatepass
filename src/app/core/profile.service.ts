import { Injectable, signal } from '@angular/core';

export interface Profile {
  name: string;
  email: string;
}

const STORAGE_KEY = 'gatepass.profile';
const DEFAULT_PROFILE: Profile = { name: 'Ada Obi', email: 'ada.obi@example.com' };

function readStoredProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    // Ignore unreadable storage and fall back to the demo profile.
  }
  return DEFAULT_PROFILE;
}

/** The attendee using this browser. Gatepass identifies attendees by email. */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly state = signal<Profile>(readStoredProfile());
  readonly profile = this.state.asReadonly();

  update(profile: Profile) {
    const next = { name: profile.name.trim(), email: profile.email.trim().toLowerCase() };
    this.state.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
