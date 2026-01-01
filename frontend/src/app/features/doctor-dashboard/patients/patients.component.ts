import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../doctor.service';
import { ModalService } from 'src/app/shared/ui/modal.service';
import { PatientDetailComponent } from './patient-detail.component';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Patients</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your assigned patients</p>
        </div>
        
        <!-- Search -->
        <div class="relative w-full md:w-80">
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
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Patient Name</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">ID</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">DOB</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr *ngFor="let patient of filteredPatients" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <!-- Name -->
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {{ patient.full_name?.charAt(0) || 'P' }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ patient.full_name }}</span>
                  </div>
                </td>
                
                <!-- ID -->
                <td class="p-4 text-gray-600 dark:text-gray-400 font-mono text-xs">
                  {{ patient._id }}
                </td>

                <!-- Age/DOB -->
                <td class="p-4 text-gray-600 dark:text-gray-400">
                   {{ patient.dob }}
                </td>

                <!-- Actions -->
                <td class="p-4 text-right">
                  <button (click)="openPatientDetail(patient)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              <!-- Empty -->
              <tr *ngIf="filteredPatients.length === 0">
                <td colspan="4" class="p-8 text-center text-gray-500 dark:text-gray-400">
                   No assigned patients found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  search = '';
  loading = false;
  error = '';

  constructor(
    private doctorService: DoctorService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.error = '';
    this.doctorService.getAssignedPatients().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.patients = data;
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load patients';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    const term = this.search.trim().toLowerCase();
    if (!term) {
       this.filteredPatients = this.patients;
    } else {
       this.filteredPatients = this.patients.filter(p => 
          p.full_name?.toLowerCase().includes(term) ||
          p._id?.toLowerCase().includes(term)
       );
    }
  }

  openPatientDetail(patient: any) {
    this.modalService.open(PatientDetailComponent, {
      data: patient
    });
  }
}