import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div class="h-16 flex items-center justify-center border-b dark:border-gray-700">
          <span class="text-2xl font-bold text-blue-600">CareFlow</span>
        </div>
        <nav class="flex-1 p-4 space-y-2">
          <a routerLink="/nurse" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>dashboard</mat-icon> Dashboard</a>
          <a routerLink="/nurse/patients" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>people</mat-icon> Patients</a>
          <a routerLink="/nurse/vitals" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>monitor_heart</mat-icon> Vitals</a>
          <a routerLink="/nurse/beds" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>bed</mat-icon> Bed Management</a>
        </nav>
      </aside>
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Topbar -->
        <header class="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow border-b dark:border-gray-700">
          <div class="flex items-center gap-4">
            <button class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><mat-icon>menu</mat-icon></button>
            <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">Nurse Dashboard</span>
          </div>
          <div class="flex items-center gap-4">
            <button (click)="toggleTheme()" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><mat-icon>dark_mode</mat-icon></button>
            <div class="flex items-center gap-2">
              <mat-icon>account_circle</mat-icon>
              <span class="text-gray-700 dark:text-gray-200">Nurse</span>
            </div>
          </div>
        </header>
        <!-- Dashboard Content -->
        <main class="flex-1 p-8 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Metrics Cards -->
            <mat-card class="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900">
              <mat-icon class="text-blue-600 text-4xl mb-2">people</mat-icon>
              <div class="text-2xl font-bold">12</div>
              <div class="text-gray-600 dark:text-gray-300">Patients</div>
            </mat-card>
            <mat-card class="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900">
              <mat-icon class="text-green-600 text-4xl mb-2">monitor_heart</mat-icon>
              <div class="text-2xl font-bold">34</div>
              <div class="text-gray-600 dark:text-gray-300">Vitals Recorded</div>
            </mat-card>
            <mat-card class="flex flex-col items-center p-6 bg-yellow-50 dark:bg-yellow-900">
              <mat-icon class="text-yellow-600 text-4xl mb-2">bed</mat-icon>
              <div class="text-2xl font-bold">8</div>
              <div class="text-gray-600 dark:text-gray-300">Beds Managed</div>
            </mat-card>
            <mat-card class="flex flex-col items-center p-6 bg-purple-50 dark:bg-purple-900">
              <mat-icon class="text-purple-600 text-4xl mb-2">assignment</mat-icon>
              <div class="text-2xl font-bold">3</div>
              <div class="text-gray-600 dark:text-gray-300">Shifts</div>
            </mat-card>
          </div>
          <!-- Quick Links -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800" routerLink="/nurse/patients">
              <mat-icon class="text-blue-600">people</mat-icon>
              <span class="font-medium">View Patients</span>
            </mat-card>
            <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800" routerLink="/nurse/vitals">
              <mat-icon class="text-green-600">monitor_heart</mat-icon>
              <span class="font-medium">Record Vitals</span>
            </mat-card>
            <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800" routerLink="/nurse/beds">
              <mat-icon class="text-yellow-600">bed</mat-icon>
              <span class="font-medium">Manage Beds</span>
            </mat-card>
          </div>
          <!-- Placeholder for child routes -->
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class NurseDashboardComponent {
  toggleTheme() {
    document.body.classList.toggle('dark');
  }
} 