import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from 'src/app/shared/layout/dashboard-layout.component';
import { MetricCardComponent } from 'src/app/shared/ui/metric-card.component';
import { ActionCardComponent } from 'src/app/shared/ui/action-card.component';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    DashboardLayoutComponent,
    MetricCardComponent,
    ActionCardComponent
],
  template: `
    <app-dashboard-layout title="Front Desk" role="Receptionist">
        <!-- Sidebar -->
        <ng-container sidebar-items>
          <a routerLink="/receptionist" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">dashboard</span> <span>Dashboard</span>
          </a>
          <a routerLink="/receptionist/patients" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">person_add</span> <span>Registration</span>
          </a>
          <a routerLink="/receptionist/appointments" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">calendar_today</span> <span>Appointments</span>
          </a>
          <a routerLink="/receptionist/checkin" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">door_front</span> <span>Admissions</span>
          </a>
        </ng-container>

        <!-- Main Content -->
        <div class="space-y-8">
            <!-- Metrics -->
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <app-metric-card label="Today's Appointments" [value]="stats?.todaysAppointments || 0" icon="calendar_today" color="blue"></app-metric-card>
                <app-metric-card label="Currently Waiting" [value]="stats?.currentlyWaiting || 0" icon="hourglass_empty" color="yellow"></app-metric-card>
                <app-metric-card label="Checked In" [value]="stats?.checkedIn || 0" icon="check_circle" color="green"></app-metric-card>
                <app-metric-card label="New Registrations" [value]="stats?.newRegistrations || 0" icon="person_add" color="purple"></app-metric-card>
            </div>

            <!-- Front Desk Actions -->
             <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div class="lg:col-span-2 space-y-6">
                     <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h2>
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <app-action-card label="New Patient" description="Register a walk-in" icon="person_add" route="/receptionist/patients" color="blue"></app-action-card>
                        <app-action-card label="Book Appointment" description="Schedule visit" icon="edit_calendar" route="/receptionist/appointments" color="green"></app-action-card>
                        <app-action-card label="Check-In Patient" description="Mark arrival" icon="login" route="/receptionist/checkin" color="yellow"></app-action-card>
                        <app-action-card label="Find Doctor" description="View doctor availability" icon="search" route="/receptionist/appointments" color="gray"></app-action-card>
                     </div>
                 </div>

                 <!-- Queue Status (Mini) -->
                 <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Waiting Room</h3>
                    <!-- TODO: Iterate over real queue data  -->
                    <div class="space-y-3">
                       @for (item of stats?.queue || []; track item) {
                         <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ item.patientName }}</span>
                            @if (item.waitTime > 0) {
                              <span class="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">{{ item.waitTime }}m wait</span>
                            } @else {
                               <span class="text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">On time</span>
                            }
                         </div>
                       }
                       @if (!stats?.queue?.length) {
                          <div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">No patients in waiting room</div>
                       }
                    </div>
                </div>
            </div>
          
            <router-outlet></router-outlet>
        </div>
    </app-dashboard-layout>
  `
})
export class ReceptionistDashboardComponent implements OnInit {
  stats: any = {};

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getReceptionistStats().subscribe({
      next: (res) => (this.stats = res.data),
      error: (err) => console.error(err)
    });
  }
}