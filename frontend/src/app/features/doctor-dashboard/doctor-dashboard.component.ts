import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from 'src/app/shared/layout/dashboard-layout.component';
import { MetricCardComponent } from 'src/app/shared/ui/metric-card.component';
import { ActionCardComponent } from 'src/app/shared/ui/action-card.component';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    DashboardLayoutComponent,
    MetricCardComponent,
    ActionCardComponent
],
  template: `
    <app-dashboard-layout title="Doctor Portal" role="Doctor">
        <ng-container sidebar-items>
          <a routerLink="/doctor" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">dashboard</span> <span>Dashboard</span>
          </a>
          <a routerLink="/doctor/patients" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">people</span> <span>My Patients</span>
          </a>
          <a routerLink="/doctor/appointments" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">calendar_month</span> <span>Schedule</span>
          </a>
          <a routerLink="/doctor/notes" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span class="material-icons text-[20px]">edit_note</span> <span>Clinical Notes</span>
          </a>
        </ng-container>

        <!-- Main Content -->
        <div class="space-y-8">
            <!-- Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <app-metric-card label="Assigned Patients" [value]="stats?.assignedPatients || 0" icon="people" color="blue"></app-metric-card>
                <app-metric-card label="Today's Visits" [value]="stats?.todayAppointments || 0" icon="event_available" color="green"></app-metric-card>
                <app-metric-card label="Pending Appointments" [value]="stats?.pendingAppointments || 0" icon="pending_actions" color="yellow"></app-metric-card>
                <app-metric-card label="Consultations" [value]="stats?.consultations || 0" icon="medical_services" color="purple"></app-metric-card>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <!-- Actions -->
                 <div class="lg:col-span-2 space-y-6">
                      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Daily Operations</h2>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <app-action-card label="View Patient List" description="Access medical records" icon="people" route="/doctor/patients" color="blue"></app-action-card>
                        <app-action-card label="My Schedule" description="Manage appointments" icon="calendar_month" route="/doctor/appointments" color="green"></app-action-card>
                        <app-action-card label="Write Notes" description="Update clinical documentation" icon="edit_note" route="/doctor/notes" color="yellow"></app-action-card>
                        <app-action-card label="Write Notes" description="Update clinical documentation" icon="edit_note" route="/doctor/notes" color="yellow"></app-action-card>
                        <!-- <app-action-card label="Collaboration" description="Chat with other staff" icon="forum" route="/doctor/collaboration" color="purple"></app-action-card> -->
                      </div>
                 </div>

                  <!-- Upcoming Schedule (Mini) -->
                  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-full">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">Upcoming Schedule</h3>
                        <a routerLink="/doctor/appointments" class="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">View All</a>
                    </div>
                    
                    <div class="space-y-4 flex-1 overflow-y-auto pr-1">
                        @for (appt of stats?.upcomingAppointments; track appt._id) {
                            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 group">
                               <!-- Time Box -->
                               <div class="flex flex-col items-center justify-center min-w-[3.5rem] bg-white dark:bg-gray-700 rounded-lg py-2 px-1 shadow-sm border border-gray-100 dark:border-gray-600">
                                   <span class="text-xs font-bold text-gray-800 dark:text-gray-200">{{ appt.date_time | date:'shortTime' }}</span>
                               </div>

                               <!-- Info -->
                               <div class="flex-1 min-w-0">
                                   <div class="flex justify-between items-start">
                                       <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ appt.patient?.full_name || 'Unknown Patient' }}</p>
                                       @if (appt.status === 'arrived') {
                                           <span class="h-2 w-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" title="Arrived"></span>
                                       }
                                   </div>
                                   <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ appt.reason || 'Consultation' }}</p>
                               </div>
                            </div>
                        }
                        @if (!stats?.upcomingAppointments?.length) {
                             <div class="flex flex-col items-center justify-center h-40 text-center text-gray-400 dark:text-gray-500">
                                 <span class="material-icons text-4xl mb-2 text-gray-300 dark:text-gray-600">event_available</span>
                                 <p class="text-sm italic">No upcoming appointments.</p>
                                 <p class="text-xs mt-1">Enjoy your free time!</p>
                             </div>
                        }
                    </div>
                  </div>
            </div>
          
            <router-outlet></router-outlet>
        </div>
    </app-dashboard-layout>
  `
})
export class DoctorDashboardComponent implements OnInit {
  stats: any = {};

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getDashboardStats().subscribe({
      next: (res) => {
          console.log('Doctor Stats Loaded:', res);
          this.stats = res.data;
      },
      error: (err) => {
          console.error('Failed to load doctor stats:', err);
          // Fallback or alert?
      }
    });
  } 
}