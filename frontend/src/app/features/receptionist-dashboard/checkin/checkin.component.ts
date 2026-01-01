import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionistService } from '../receptionist.service';

@Component({
  selector: 'app-receptionist-checkin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6 max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
           <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Patient Check-In</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400">Mark patients as arrived for their appointments</p>
        </div>
        
        <!-- Search -->
        <div class="relative w-full max-w-xs">
           <input 
             type="text" 
             [(ngModel)]="search" 
             (ngModelChange)="applyFilter()" 
             placeholder="Search by name or ID..."
             class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
           >
           <span class="material-icons absolute left-3 top-3 text-gray-400">search</span>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" *ngIf="!loading">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Name</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
               <tr *ngFor="let patient of filteredPatients" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                 <td class="p-4 font-medium text-gray-900 dark:text-white">{{ patient.full_name }}</td>
                 <td class="p-4">
                    <span [class]="'px-2.5 py-1 rounded-full text-xs font-medium border ' + 
                       (patient.current_status === 'admitted' 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')">
                       {{ patient.current_status === 'admitted' ? 'Admitted' : (patient.current_status || 'Not Admitted') }}
                    </span>
                 </td>
                 <td class="p-4 text-right">
                    <button 
                       *ngIf="patient.current_status !== 'admitted'"
                       (click)="checkIn(patient)"
                       class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                       Check In
                    </button>
                    <span *ngIf="patient.current_status === 'admitted'" class="text-green-600 dark:text-green-400 flex items-center justify-end gap-1 text-sm font-medium">
                       <span class="material-icons text-sm">check_circle</span> Checked In
                    </span>
                 </td>
               </tr>
               <tr *ngIf="filteredPatients.length === 0">
                 <td colspan="3" class="p-8 text-center text-gray-500 dark:text-gray-400">No patients found.</td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CheckinComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  search = '';
  loading = false;
  error = '';

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.error = '';
    this.receptionistService.getPatients().subscribe({
      next: (res: any) => {
        this.patients = res.data || res;
        this.filteredPatients = this.patients;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load patients';
        this.loading = false;
      }
    });
  }

  checkIn(patient: any) {
    // Optimistic update
    const previousStatus = patient.current_status;
    patient.current_status = 'admitted';

    this.receptionistService.checkInPatient(patient._id).subscribe({
      next: () => {
        // success
      },
      error: () => {
        // revert
        patient.current_status = previousStatus;
        alert('Check-in failed');
      }
    });
  }

  applyFilter() {
    const term = this.search.trim().toLowerCase();
    this.filteredPatients = this.patients.filter(p => 
       p.full_name?.toLowerCase().includes(term) ||
       p._id?.toLowerCase().includes(term)
    );
  }
}