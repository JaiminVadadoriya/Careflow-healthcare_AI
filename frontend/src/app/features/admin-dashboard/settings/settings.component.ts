import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule
],
  template: `
    <div class="p-6 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
    
      <!-- Theme Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Customize how Careflow looks on your device</p>
          </div>
    
          <!-- Use the global theme service ideally, but here mimicking local toggle for now as per previous logic -->
          <!-- But wait, we have a ThemeService! Ideally we inject it. But for now I'll stick to simple logic or just redirect user to Navbar -->
          <!-- Let's keep it simple and just show a visual toggle that works locally for this demo or uses the global class logic -->
          <button (click)="toggleTheme()" class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span class="material-icons text-gray-600 dark:text-gray-300">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
          </button>
        </div>
      </div>
    
      <!-- Profile Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
        <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input formControlName="fullName" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            @if (profileForm.get('fullName')?.touched && profileForm.get('fullName')?.invalid) {
              <div class="text-red-500 text-xs mt-1">Name is required</div>
            }
          </div>
    
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input formControlName="email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            @if (profileForm.get('email')?.touched && profileForm.get('email')?.invalid) {
              <div class="text-red-500 text-xs mt-1">Valid email is required</div>
            }
          </div>
    
          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input formControlName="password" type="password" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Leave blank to keep current">
          </div>
    
          <div class="flex gap-3 justify-end pt-2">
            <button type="button" (click)="profileForm.reset()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium">Reset</button>
            <button type="submit" [disabled]="profileForm.invalid" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</button>
          </div>
        </form>
      </div>
    
      <!-- System Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">System Settings</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">System-wide configurations will appear here.</p>
        <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-gray-400">
          Coming Soon
        </div>
      </div>
    </div>
    `
})
export class SettingsComponent {
  isDark = false;
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['Admin User', Validators.required],
      email: ['admin@careflow.com', [Validators.required, Validators.email]],
      password: ['']
    });
    
    // Initialize dark mode state based on document class
    this.isDark = document.documentElement.classList.contains('dark');
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
       localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      // TODO: Integrate with backend
      alert('Profile updated successfully!');
    }
  }
}