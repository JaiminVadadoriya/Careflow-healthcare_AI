import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from 'src/app/shared/layout/dashboard-layout.component';
import { MetricCardComponent } from 'src/app/shared/ui/metric-card.component';
import { ActionCardComponent } from 'src/app/shared/ui/action-card.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
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
                <app-metric-card label="Assigned Patients" value="18" icon="people" color="blue"></app-metric-card>
                <app-metric-card label="Today's Visits" value="7" icon="event_available" color="green"></app-metric-card>
                <app-metric-card label="Pending Notes" value="12" icon="description" color="yellow"></app-metric-card>
                <app-metric-card label="Consultations" value="3" icon="medical_services" color="purple"></app-metric-card>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <!-- Actions -->
                 <div class="lg:col-span-2 space-y-6">
                      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Daily Operations</h2>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <app-action-card label="View Patient List" description="Access medical records" icon="people" route="/doctor/patients" color="blue"></app-action-card>
                        <app-action-card label="My Schedule" description="Manage appointments" icon="calendar_month" route="/doctor/appointments" color="green"></app-action-card>
                        <app-action-card label="Write Notes" description="Update clinical documentation" icon="edit_note" route="/doctor/notes" color="yellow"></app-action-card>
                        <app-action-card label="Collaboration" description="Chat with other staff" icon="forum" route="/doctor/collaboration" color="purple"></app-action-card>
                      </div>
                 </div>

                 <!-- Upcoming Schedule (Mini) -->
                 <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm h-fit">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Upcoming</h3>
                    <div class="space-y-4">
                        <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                           <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">10:00 AM - Consultation</p>
                           <p class="text-xs text-gray-500 dark:text-gray-400">Sarah Johnson - Room 302</p>
                        </div>
                        <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-300">
                           <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">11:30 AM - Follow-up</p>
                           <p class="text-xs text-gray-500 dark:text-gray-400">Michael Brown - Room 104</p>
                        </div>
                    </div>
                 </div>
            </div>
          
            <router-outlet></router-outlet>
        </div>
    </app-dashboard-layout>
  `
})
export class DoctorDashboardComponent {} 