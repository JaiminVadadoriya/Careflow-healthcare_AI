import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
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
          <button (click)="toggleTheme()" class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span class="material-icons text-gray-600 dark:text-gray-300">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>
          </button>
        </div>
      </div>

       <!-- System Settings (Dynamic) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
             <h3 class="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h3>
             <button (click)="loadSettings()" class="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Global settings affecting the entire application.</p>
        
        @if (loadingSettings) {
             <div class="text-center py-4 text-gray-500">Loading settings...</div>
        } @else {
             <div class="space-y-4">
                @for (setting of systemSettings; track setting.key) {
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">{{ setting.key | titlecase }}</p>
                            <p class="text-xs text-gray-500">{{ setting.description || 'No description' }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                             @if (editingKey === setting.key) {
                                 <input type="text" [(ngModel)]="tempValue" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm">
                                 <button (click)="saveSetting(setting)" class="text-green-600 hover:text-green-700"><span class="material-icons">check</span></button>
                                 <button (click)="cancelEdit()" class="text-gray-500 hover:text-gray-700"><span class="material-icons">close</span></button>
                             } @else {
                                 <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">{{ setting.value }}</span>
                                 <button (click)="startEdit(setting)" class="text-blue-600 hover:text-blue-700"><span class="material-icons text-sm">edit</span></button>
                             }
                        </div>
                    </div>
                }
                @if (systemSettings.length === 0) {
                    <div class="text-center py-4 text-gray-400 text-sm italic">No system settings found.</div>
                }
             </div>
             
             <!-- Add New Setting -->
             <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Setting</h4>
                <div class="flex flex-col sm:flex-row gap-2">
                    <input type="text" [(ngModel)]="newSettingKey" placeholder="Key (e.g. hospital_name)" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm">
                    <input type="text" [(ngModel)]="newSettingValue" placeholder="Value" class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm">
                    <button (click)="addSetting()" [disabled]="!newSettingKey || !newSettingValue" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">Add</button>
                </div>
             </div>
        }
      </div>
    
      <!-- Profile Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
        <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input formControlName="fullName" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          </div>
    
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input formControlName="email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          </div>
    
          <div class="flex gap-3 justify-end pt-2">
            <button type="submit" [disabled]="profileForm.invalid" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all font-medium disabled:opacity-50">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
    `
})
export class SettingsComponent implements OnInit {
  isDark = false;
  profileForm: FormGroup;
  
  // System Settings
  systemSettings: any[] = [];
  loadingSettings = false;
  editingKey: string | null = null;
  tempValue: any = '';
  newSettingKey = '';
  newSettingValue = '';

  constructor(
      private fb: FormBuilder,
      private dashboardService: DashboardService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['Admin User', Validators.required],
      email: ['admin@careflow.com', [Validators.required, Validators.email]],
      password: ['']
    });
    
    this.isDark = document.documentElement.classList.contains('dark');
  }

  ngOnInit() {
      this.loadSettings();
  }

  loadSettings() {
      this.loadingSettings = true;
      this.dashboardService.getSettings().subscribe({
          next: (res: any) => {
              this.systemSettings = res.data || [];
              this.loadingSettings = false;
          },
          error: (err) => {
              console.error('Failed to load settings', err);
              this.loadingSettings = false;
          }
      });
  }

  startEdit(setting: any) {
      this.editingKey = setting.key;
      this.tempValue = setting.value;
  }

  cancelEdit() {
      this.editingKey = null;
      this.tempValue = '';
  }

  saveSetting(setting: any) {
      this.dashboardService.updateSetting({ key: setting.key, value: this.tempValue }).subscribe({
          next: () => {
              setting.value = this.tempValue;
              this.cancelEdit();
          },
          error: (err) => alert('Failed to update setting')
      });
  }

  addSetting() {
      if (!this.newSettingKey || !this.newSettingValue) return;
      
      this.dashboardService.updateSetting({ key: this.newSettingKey, value: this.newSettingValue }).subscribe({
          next: (res: any) => {
              this.systemSettings.push(res.data);
              this.newSettingKey = '';
              this.newSettingValue = '';
          },
          error: (err) => alert('Failed to create setting')
      });
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
      alert('Profile update simulation: Success!');
    }
  }
}