import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    SharedModule,
  ],
  // template: `
  //   <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
  //     <!-- Sidebar -->
  //     <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
  //       <div class="h-16 flex items-center justify-center border-b dark:border-gray-700">
  //         <span class="text-2xl font-bold text-blue-600">CareFlow</span>
  //       </div>
  //       <nav class="flex-1 p-4 space-y-2">
  //         <a routerLink="/admin" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>dashboard</mat-icon> Dashboard</a>
  //         <a routerLink="/admin/users" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>group</mat-icon> User Management</a>
  //         <a routerLink="/admin/reports" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>bar_chart</mat-icon> Reports</a>
  //         <a routerLink="/admin/settings" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>settings</mat-icon> Settings</a>
  //       </nav>
  //     </aside>
  //     <!-- Main Content -->
  //     <div class="flex-1 flex flex-col">
  //       <!-- Topbar -->
  //       <header class="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow border-b dark:border-gray-700">
  //         <div class="flex items-center gap-4">
  //           <button class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><mat-icon>menu</mat-icon></button>
  //           <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">Admin Dashboard</span>
  //         </div>
  //         <div class="flex items-center gap-4">
  //           <button (click)="toggleTheme()" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><mat-icon>dark_mode</mat-icon></button>
  //           <div class="flex items-center gap-2">
  //             <mat-icon>account_circle</mat-icon>
  //             <span class="text-gray-700 dark:text-gray-200">Admin</span>
  //           </div>
  //         </div>
  //       </header>
  //       <!-- Dashboard Content -->
  //       <main class="flex-1 p-8 overflow-y-auto">
  //         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  //           <!-- Metrics Cards -->
  //           <mat-card class="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900">
  //             <mat-icon class="text-blue-600 text-4xl mb-2">group</mat-icon>
  //             <div class="text-2xl font-bold">120</div>
  //             <div class="text-gray-600 dark:text-gray-300">Users</div>
  //           </mat-card>
  //           <mat-card class="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900">
  //             <mat-icon class="text-green-600 text-4xl mb-2">event</mat-icon>
  //             <div class="text-2xl font-bold">45</div>
  //             <div class="text-gray-600 dark:text-gray-300">Appointments</div>
  //           </mat-card>
  //           <mat-card class="flex flex-col items-center p-6 bg-yellow-50 dark:bg-yellow-900">
  //             <mat-icon class="text-yellow-600 text-4xl mb-2">inventory_2</mat-icon>
  //             <div class="text-2xl font-bold">32</div>
  //             <div class="text-gray-600 dark:text-gray-300">Inventory Items</div>
  //           </mat-card>
  //           <mat-card class="flex flex-col items-center p-6 bg-red-50 dark:bg-red-900">
  //             <mat-icon class="text-red-600 text-4xl mb-2">bed</mat-icon>
  //             <div class="text-2xl font-bold">8</div>
  //             <div class="text-gray-600 dark:text-gray-300">Beds Occupied</div>
  //           </mat-card>
  //         </div>
  //         <!-- Quick Links -->
  //         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  //           <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800" routerLink="/admin/users">
  //             <mat-icon class="text-blue-600">group_add</mat-icon>
  //             <span class="font-medium">Manage Users</span>
  //           </mat-card>
  //           <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800" routerLink="/admin/reports">
  //             <mat-icon class="text-green-600">bar_chart</mat-icon>
  //             <span class="font-medium">View Reports</span>
  //           </mat-card>
  //           <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-800" routerLink="/admin/settings">
  //             <mat-icon class="text-yellow-600">settings</mat-icon>
  //             <span class="font-medium">Settings</span>
  //           </mat-card>
  //           <mat-card class="flex items-center gap-4 p-4 cursor-pointer hover:bg-red-100 dark:hover:bg-red-800" routerLink="/admin/inventory">
  //             <mat-icon class="text-red-600">inventory_2</mat-icon>
  //             <span class="font-medium">Inventory</span>
  //           </mat-card>
  //         </div>
  //         <!-- Recent Activity -->
  //         <div>
  //           <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
  //           <mat-list>
  //             <mat-list-item *ngFor="let activity of recentActivity">
  //               <mat-icon matListIcon>history</mat-icon>
  //               <div matLine>{{ activity.text }}</div>
  //               <div matLine class="text-xs text-gray-400">{{ activity.time }}</div>
  //             </mat-list-item>
  //           </mat-list>
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // `,
  templateUrl: './admin-dashboard.component.html',
  styles: [``],
})
export class AdminDashboardComponent implements OnInit {
  user: any;
  role: string = '';
  darkMode = false;
  recentActivity = [
    { text: 'User John Doe created', time: '2 min ago' },
    { text: 'Inventory updated', time: '10 min ago' },
    { text: 'Appointment booked', time: '30 min ago' },
    { text: 'Bed assigned to patient', time: '1 hr ago' },
  ];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.role = this.user?.role;
    console.log('Logged-in Role:', this.role);
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.getElementById('rootBody');
    if (this.darkMode) {
      body?.classList.add('dark');
    } else {
      body?.classList.remove('dark');
    }
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isDoctor(): boolean {
    return this.role === 'doctor';
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());

    const body = document.getElementById('rootBody');
    if (this.darkMode) {
      body?.classList.add('dark');
    } else {
      body?.classList.remove('dark');
    }
  }

  // etc.
}
