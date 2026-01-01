import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardLayoutComponent } from 'src/app/shared/layout/dashboard-layout.component';
import { MetricCardComponent } from 'src/app/shared/ui/metric-card.component';
import { ActionCardComponent } from 'src/app/shared/ui/action-card.component';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    SharedModule,
    DashboardLayoutComponent,
    MetricCardComponent,
    ActionCardComponent
],
  template: `
    <app-dashboard-layout title="Overview" role="Admin">
      <ng-container sidebar-items>
        <a routerLink="/dashboard" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span class="material-icons text-[20px]">dashboard</span> <span>Dashboard</span>
        </a>
        <a routerLink="/dashboard/users" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span class="material-icons text-[20px]">group</span> <span>User Management</span>
        </a>
        <a routerLink="/dashboard/reports" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span class="material-icons text-[20px]">bar_chart</span> <span>Reports</span>
        </a>
        <a routerLink="/dashboard/settings" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span class="material-icons text-[20px]">settings</span> <span>Settings</span>
        </a>
      </ng-container>
    
      <!-- Main Content -->
      <div class="space-y-8">
    
        <!-- Metrics Grid -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Key Metrics</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <app-metric-card label="Total Users" [value]="stats?.totalUsers || 0" icon="group" color="blue"></app-metric-card>
            <app-metric-card label="Appointments" [value]="stats?.totalAppointments || 0" icon="event" color="green"></app-metric-card>
            <app-metric-card label="Inventory Items" [value]="stats?.totalInventoryItems || 0" icon="inventory_2" color="yellow"></app-metric-card>
            <app-metric-card label="Occupied Beds" [value]="stats?.occupiedBeds || 0" icon="bed" color="red"></app-metric-card>
          </div>
        </section>
    
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Quick Actions -->
          <div class="lg:col-span-2 space-y-6">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <app-action-card label="Manage Users" description="Add, edit, or remove system users" icon="group_add" route="/dashboard/users" color="blue"></app-action-card>
              <app-action-card label="View Reports" description="Analyze system performance" icon="bar_chart" route="/dashboard/reports" color="green"></app-action-card>
              <app-action-card label="Global Settings" description="Configure application preferences" icon="settings" route="/dashboard/settings" color="yellow"></app-action-card>
              <app-action-card label="Check Inventory" description="Monitor stock levels" icon="inventory_2" route="/inventory" color="red"></app-action-card>
            </div>
          </div>
    
          <!-- Recent Activity Feed -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Activity Log</h3>
            <div class="space-y-4">
              @for (activity of recentActivity; track activity) {
                <div class="flex gap-4 items-start">
                  <div class="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                  <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 font-medium">{{ activity.text }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                  </div>
                </div>
              }
            </div>
            <button class="w-full mt-6 py-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">View All History</button>
          </div>
        </div>
    
        <router-outlet></router-outlet>
      </div>
    </app-dashboard-layout>
    `
})
export class AdminDashboardComponent implements OnInit {
  // TODO: Fetch recent activity from backend API
  recentActivity = [
    { text: 'User John Doe created', time: '2 min ago' },
    { text: 'Inventory updated by Jane', time: '10 min ago' },
    { text: 'Appointment #1234 booked', time: '30 min ago' },
    { text: 'Bed 4 assigned to Patient X', time: '1 hr ago' },
  ];

  stats: any = {};

  constructor(
    private auth: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.dashboardService.getAdminStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: (err) => console.error('Error loading admin stats', err)
    });
  }
}
