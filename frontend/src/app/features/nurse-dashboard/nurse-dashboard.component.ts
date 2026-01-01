import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from 'src/app/shared/layout/dashboard-layout.component';
import { MetricCardComponent } from 'src/app/shared/ui/metric-card.component';
import { ActionCardComponent } from 'src/app/shared/ui/action-card.component';

@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardLayoutComponent,
    MetricCardComponent,
    ActionCardComponent
  ],
  template: `
    <app-dashboard-layout title="Nurse Station" role="Nurse">
        <!-- Sidebar Items -->
        <ng-container sidebar-items>
            <a routerLink="/nurse" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons text-[20px]">dashboard</span> <span>Dashboard</span>
            </a>
            <a routerLink="/nurse/patients" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons text-[20px]">ward</span> <span>My Ward</span>
            </a>
            <a routerLink="/nurse/vitals" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons text-[20px]">monitor_heart</span> <span>Vitals</span>
            </a>
            <a routerLink="/nurse/beds" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons text-[20px]">bed</span> <span>Bed Manager</span>
            </a>
        </ng-container>

        <!-- Main Content -->
        <div class="space-y-8">
            <!-- Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <app-metric-card label="Ward Capacity" value="34/40" icon="groups" color="blue"></app-metric-card>
                <app-metric-card label="Critical Alerts" value="2" icon="warning" color="red"></app-metric-card>
                <app-metric-card label="Vitals Recorded" value="156" icon="monitor_heart" color="green"></app-metric-card>
                <app-metric-card label="Empty Beds" value="6" icon="bed" color="yellow"></app-metric-card>
            </div>

            <!-- Tasks & Actions -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                     <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Shift Actions</h2>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <app-action-card label="Patient Rounds" description="View assigned patients" icon="ward" route="/nurse/patients" color="blue"></app-action-card>
                        <app-action-card label="Record Vitals" description="Log patient stats" icon="monitor_heart" route="/nurse/vitals" color="green"></app-action-card>
                        <app-action-card label="Bed Assignment" description="Manage admissions" icon="bed" route="/nurse/beds" color="yellow"></app-action-card>
                     </div>
                </div>

                <!-- Shift Info -->
                <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Current Shift</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-500">Shift Lead</span>
                            <span class="font-medium text-gray-900 dark:text-gray-100">Nurse Jackie</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-500">Hours</span>
                            <span class="font-medium text-gray-900 dark:text-gray-100">07:00 - 19:00</span>
                        </div>
                        <div class="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                        <div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-xs">
                            <strong class="block mb-1">📢 Handover Note:</strong>
                            Patient in Bed 12 has elevated BP. Monitor closely every hour.
                        </div>
                    </div>
                </div>
            </div>

            <router-outlet></router-outlet>
        </div>
    </app-dashboard-layout>
  `
})
export class NurseDashboardComponent {}