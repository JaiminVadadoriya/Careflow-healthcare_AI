import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NurseService } from '../nurse.service';

@Component({
  selector: 'app-vitals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <span class="material-icons text-blue-600 dark:text-blue-400">monitor_heart</span> Record Vitals
        </h2>

        <!-- Alerts -->
        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-2">
           <span class="material-icons text-xl">check_circle</span> {{ successMessage }}
        </div>
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
           <span class="material-icons text-xl">error</span> {{ errorMessage }}
        </div>

        <form (ngSubmit)="submitVitals()" class="space-y-5">
           <!-- Patient ID -->
           <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient ID</label>
              <input 
                type="text" 
                [(ngModel)]="patientId" 
                name="patientId" 
                required 
                placeholder="Enter Patient ID"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- BP -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Pressure</label>
                <input type="text" [(ngModel)]="vitals.blood_pressure" name="bp" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="120/80">
              </div>
              <!-- HR -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heart Rate (bpm)</label>
                <input type="number" [(ngModel)]="vitals.heart_rate" name="hr" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="72">
              </div>
              <!-- Temp -->
               <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temperature (°C)</label>
                <input type="number" step="0.1" [(ngModel)]="vitals.temperature" name="temp" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="36.5">
              </div>
              <!-- O2 -->
               <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Oxygen Saturation (%)</label>
                <input type="number" [(ngModel)]="vitals.oxygen_saturation" name="o2" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="98">
              </div>
           </div>

           <div class="pt-4">
              <button 
                type="submit" 
                [disabled]="!patientId || loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {{ loading ? 'Saving...' : 'Submit Vitals' }}
              </button>
           </div>
        </form>
      </div>
    </div>
  `
})
export class VitalsComponent {
  patientId = '';
  vitals = { blood_pressure: '', heart_rate: '', temperature: '', oxygen_saturation: '' };
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private nurseService: NurseService) {}

  submitVitals() {
    if (!this.patientId) {
      this.errorMessage = 'Patient ID is required';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.nurseService.addPatientVitals(this.patientId, this.vitals).subscribe({
      next: () => {
        this.successMessage = 'Vitals submitted successfully.';
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Submission failed.';
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.vitals = { blood_pressure: '', heart_rate: '', temperature: '', oxygen_saturation: '' };
    this.patientId = '';
  }
}
