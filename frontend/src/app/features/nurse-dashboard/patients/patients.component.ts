import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NurseService } from '../nurse.service';
import { ModalService } from 'src/app/shared/ui/modal.service';
import { PatientDetailComponent } from './patient-detail.component';

@Component({
  selector: 'app-nurse-patients',
  standalone: true,
  imports: [
    FormsModule
],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Ward Patients</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage assigned patients and vitals</p>
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
        @if (loading) {
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
    
        <!-- Content -->
        @if (!loading) {
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Patient Name</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">ID</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Gender</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  @for (patient of filteredPatients; track patient) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td class="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {{ patient.full_name?.charAt(0) || 'P' }}
                        </div>
                        {{ patient.full_name }}
                      </td>
                      <td class="p-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{{ patient._id }}</td>
                      <td class="p-4 text-gray-600 dark:text-gray-400 capitalize">{{ patient.gender }}</td>
                      <td class="p-4 text-right">
                        <button (click)="openPatientDetail(patient)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  }
                  @if (filteredPatients.length === 0) {
                    <tr>
                      <td colspan="4" class="p-8 text-center text-gray-500 dark:text-gray-400">
                        No assigned patients found.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    `
})

export class PatientsComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  search = '';
  loading = false;

  constructor(
    private nurseService: NurseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.nurseService.getAssignedPatients().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.patients = Array.isArray(data) ? data : [];
        this.filteredPatients = this.patients;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
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

  openPatientDetail(patient: any) {
    this.router.navigate(['/nurse/patients', patient._id]);
  }
}