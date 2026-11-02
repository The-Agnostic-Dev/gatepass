import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfileService } from './core/profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly profiles = inject(ProfileService);
  protected readonly editingProfile = signal(false);
  protected draftName = '';
  protected draftEmail = '';

  protected editProfile() {
    const { name, email } = this.profiles.profile();
    this.draftName = name;
    this.draftEmail = email;
    this.editingProfile.set(true);
  }

  protected saveProfile() {
    if (!this.draftName.trim() || !this.draftEmail.trim()) return;
    this.profiles.update({ name: this.draftName, email: this.draftEmail });
    this.editingProfile.set(false);
  }
}
