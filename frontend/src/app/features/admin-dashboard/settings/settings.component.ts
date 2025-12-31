import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <mat-card class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Theme</h2>
          <button mat-stroked-button (click)="toggleTheme()">
            <mat-icon>{{ isDark ? 'dark_mode' : 'light_mode' }}</mat-icon>
            {{ isDark ? 'Dark' : 'Light' }} Mode
          </button>
        </div>
      </mat-card>
      <mat-card class="mb-8">
        <h2 class="text-xl font-bold mb-4">Profile Settings</h2>
        <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="flex flex-col gap-4">
          <mat-form-field >
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" required>
            <mat-error *ngIf="profileForm.get('fullName')?.hasError('required')">Name is required</mat-error>
          </mat-form-field>
          <mat-form-field >
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email">
            <mat-error *ngIf="profileForm.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="profileForm.get('email')?.hasError('email')">Invalid email</mat-error>
          </mat-form-field>
          <mat-form-field >
            <mat-label>New Password</mat-label>
            <input matInput formControlName="password" type="password">
          </mat-form-field>
          <div class="flex gap-2 justify-end mt-4">
            <button mat-button type="button" (click)="profileForm.reset()">Reset</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid">Save</button>
          </div>
        </form>
      </mat-card>
      <mat-card>
        <h2 class="text-xl font-bold mb-4">System Settings</h2>
        <p class="text-gray-600">(System settings coming soon...)</p>
      </mat-card>
    </div>
  `
})
export class SettingsComponent {
  isDark = false;
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      fullName: ['Admin User', Validators.required],
      email: ['admin@careflow.com', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark', this.isDark);
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      // TODO: Integrate with backend
      this.snackBar.open('Profile updated!', 'Close', { duration: 2000 });
    }
  }
} 