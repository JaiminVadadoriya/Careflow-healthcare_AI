import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400">Manage your consultation schedule</p>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-gray-50 dark:bg-gray-900/50 p-2 -mx-2 rounded-xl backdrop-blur-sm z-10">
         <!-- Status Filter -->
         <div class="w-full md:w-1/4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Status</label>
            <div class="relative">
              <select [(ngModel)]="statusFilter" (change)="applyFilter()" class="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span class="material-icons absolute right-3 top-3 text-gray-400 text-sm pointer-events-none">expand_more</span>
            </div>
         </div>

         <!-- Date Filter -->
         <div class="w-full md:w-1/4">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Date</label>
            <input type="date" [(ngModel)]="dateFilter" (change)="applyFilter()" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
         </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Error -->
      <div *ngIf="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
         {{ error }}
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" *ngIf="!loading">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Patient</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Date</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr *ngFor="let appt of filteredAppointments" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <!-- Patient -->
                <td class="p-4 font-medium text-gray-900 dark:text-white">
                  {{ appt.patient }}
                </td>
                
                <!-- Date -->
                <td class="p-4 text-gray-600 dark:text-gray-400">
                  {{ appt.date }}
                </td>

                <!-- Status -->
                <td class="p-4">
                  <span [class]="'px-2.5 py-1 rounded-full text-xs font-medium capitalize border ' + 
                    (appt.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                     appt.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                     'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800')">
                    {{ appt.status }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2" *ngIf="appt.status === 'scheduled'">
                    <button (click)="markCompleted(appt)" class="text-xs bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg transition-colors">
                      Complete
                    </button>
                    <button (click)="markCancelled(appt)" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                  <span *ngIf="appt.status !== 'scheduled'" class="text-xs text-gray-400 italic">No actions</span>
                </td>
              </tr>
              <!-- Empty -->
              <tr *ngIf="filteredAppointments.length === 0">
                <td colspan="4" class="p-8 text-center text-gray-500 dark:text-gray-400">
                   No appointments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  statusFilter = '';
  dateFilter = '';
  loading = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.error = '';
    this.doctorService.getAppointments().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.appointments = data;
        this.filteredAppointments = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    let filtered = this.appointments;
    if (this.statusFilter) {
      filtered = filtered.filter((a: any) => a.status === this.statusFilter);
    }
    if (this.dateFilter) {
      filtered = filtered.filter((a: any) => a.date === this.dateFilter);
    }
    this.filteredAppointments = filtered;
  }

  markCompleted(appt: any) {
    const oldStatus = appt.status;
    appt.status = 'completed';
    // Optimistic Update
    this.doctorService.updateMedicalRecord(appt._id, { status: 'completed' }).subscribe({
      next: () => {},
      error: () => { 
        appt.status = oldStatus; // Revert
        alert('Failed to update status');
      }
    });
  }

  markCancelled(appt: any) {
    const oldStatus = appt.status;
    appt.status = 'cancelled';
    this.doctorService.updateMedicalRecord(appt._id, { status: 'cancelled' }).subscribe({
      next: () => {},
      error: () => { 
        appt.status = oldStatus; 
        alert('Failed to update status');
      }
    });
  }
}