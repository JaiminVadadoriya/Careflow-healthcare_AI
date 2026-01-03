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
        <a routerLink="/dashboard" routerLinkActive="bg-white/10 text-white shadow-lg" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
          <span class="material-icons text-[20px] group-hover:scale-110 transition-transform">dashboard</span> <span>Dashboard</span>
        </a>
        <a routerLink="/dashboard/users" routerLinkActive="bg-white/10 text-white shadow-lg" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
          <span class="material-icons text-[20px] group-hover:scale-110 transition-transform">group</span> <span>User Management</span>
        </a>
        <a routerLink="/dashboard/reports" routerLinkActive="bg-white/10 text-white shadow-lg" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
          <span class="material-icons text-[20px] group-hover:scale-110 transition-transform">bar_chart</span> <span>Reports</span>
        </a>
        <a routerLink="/dashboard/settings" routerLinkActive="bg-white/10 text-white shadow-lg" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
          <span class="material-icons text-[20px] group-hover:scale-110 transition-transform">settings</span> <span>Settings</span>
        </a>
      </ng-container>
    
      <!-- Main Content -->
      <div class="space-y-8 max-w-[1600px] mx-auto">
        
        <!-- Welcome Banner -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 p-8 shadow-xl border border-slate-700/50">
            <!-- Decorative shapes -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 class="text-3xl font-bold text-white mb-2">Welcome back, Admin</h1>
                    <p class="text-slate-400 text-lg">Here's what's happening in your hospital today.</p>
                </div>
                <div class="flex gap-3">
                    <span class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm backdrop-blur-md flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
                    </span>
                    <span class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm backdrop-blur-md">
                        {{ today | date:'fullDate' }}
                    </span>
                </div>
            </div>
        </div>
    
        <!-- Metrics Grid -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <!-- Custom Metric Cards with modern styling -->
             <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <span class="material-icons text-2xl">group</span>
                    </div>
                    <span class="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30">+12%</span>
                </div>
                <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Users</h3>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats?.totalUsers || 0 }}</p>
             </div>

             <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                        <span class="material-icons text-2xl">event_available</span>
                    </div>
                    <span class="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-900/30">+5%</span>
                </div>
                <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Appointments</h3>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats?.totalAppointments || 0 }}</p>
             </div>

             <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                        <span class="material-icons text-2xl">inventory_2</span>
                    </div>
                    <span class="text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700">Stable</span>
                </div>
                <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Inventory Items</h3>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats?.totalInventoryItems || 0 }}</p>
             </div>

             <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                        <span class="material-icons text-2xl">king_bed</span>
                    </div>
                    <span class="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/30">Occupancy</span>
                </div>
                <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Beds</h3>
                <p class="text-3xl font-bold text-slate-800 dark:text-white">{{ stats?.occupiedBeds || 0 }}</p>
             </div>
        </section>
    
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Quick Actions -->
          <div class="xl:col-span-2 space-y-6">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-6 rounded-full bg-blue-600"></span> Quick Actions
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <app-action-card label="Manage Users" description="Add, edit, or remove system users" icon="group_add" route="/dashboard/users" color="blue"></app-action-card>
              <app-action-card label="View Reports" description="Analyze system performance" icon="bar_chart" route="/dashboard/reports" color="green"></app-action-card>
              <app-action-card label="Global Settings" description="Configure application preferences" icon="settings" route="/dashboard/settings" color="yellow"></app-action-card>
              <app-action-card label="Check Inventory" description="Monitor stock levels" icon="inventory_2" route="/inventory" color="red"></app-action-card>
            </div>
          </div>
    
          <!-- Recent Activity Feed -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-slate-800 dark:text-white">Activity Log</h3>
                <button class="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
            </div>
            
            <div class="relative pl-4 border-l border-slate-100 dark:border-slate-800 space-y-8">
              @for (activity of recentActivity; track activity) {
                <div class="relative">
                  <!-- Timeline dot -->
                  <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500"></div>
                  
                  <div class="space-y-1">
                    <p class="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{{ activity.text }}</p>
                    <p class="text-xs text-slate-400">{{ activity.time }}</p>
                  </div>
                </div>
              }
              @if (!recentActivity.length) {
                  <p class="text-sm text-slate-400 italic">No recent activity.</p>
              }
            </div>
          </div>
        </div>
    
        <router-outlet></router-outlet>
      </div>
    </app-dashboard-layout>
    `
})
export class AdminDashboardComponent implements OnInit {
  recentActivity: any[] = [];

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
        // Use stats.recentActivity if properly populated by backend, or fetch separate
        if (this.stats.recentActivity) {
            this.recentActivity = this.stats.recentActivity.map((log: any) => ({
                text: log.text || `${log.action} - ${log.details?.newValue || ''}`,
                time: new Date(log.time).toLocaleString() // Simple formatting
            }));
        }
      },
      error: (err) => console.error('Error loading admin stats', err)
    });
  }
}
