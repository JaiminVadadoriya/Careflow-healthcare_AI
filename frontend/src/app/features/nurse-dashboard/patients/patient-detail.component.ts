import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NurseService } from '../nurse.service';
import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-nurse-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[600px] h-fit max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-700 font-sans flex flex-col">
       <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10 shrink-0">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ data.full_name }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Patient Vitals & History</p>
        </div>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="p-6 overflow-y-auto grow">
         <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4 mb-6">
           <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">ID</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ data._id }}</span>
           </div>
           <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <span class="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">DOB</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ data.dob }}</span>
           </div>
        </div>

        <!-- Add Vitals Form -->
        <div class="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800 mb-6">
           <h3 class="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
             <span class="material-icons text-sm">add_circle</span> Add Vitals
           </h3>
           <form (ngSubmit)="addVitals()" class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Blood Pressure</label>
                <input [(ngModel)]="vitals.blood_pressure" name="bp" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="120/80">
              </div>
              <div>
                <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Heart Rate</label>
                <input [(ngModel)]="vitals.heart_rate" name="hr" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="72">
              </div>
              <div>
                <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Temperature</label>
                <input [(ngModel)]="vitals.temperature" name="temp" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="36.5">
              </div>
              <div>
                <label class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">O2 Saturation</label>
                <input [(ngModel)]="vitals.oxygen_saturation" name="o2" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="98">
              </div>
              <div class="col-span-2 flex justify-end gap-2 mt-2">
                 <button type="button" (click)="resetForm()" class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Reset</button>
                 <button type="submit" [disabled]="loading" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50">
                    {{ loading ? 'Saving...' : 'Save Vitals' }}
                 </button>
              </div>
           </form>
        </div>

        <!-- Vitals History -->
        <div *ngIf="vitalsHistory.length > 0">
           <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
             <span class="material-icons text-green-500 text-sm">history</span> History
           </h3>
           <div class="space-y-3">
              <div *ngFor="let vital of vitalsHistory" class="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <div class="text-sm">
                    <span class="font-medium text-gray-900 dark:text-white block mb-1">{{ vital.date | date }}</span>
                    <div class="text-gray-500 dark:text-gray-400 text-xs flex gap-3">
                       <span>BP: <strong class="text-gray-700 dark:text-gray-300">{{ vital.blood_pressure }}</strong></span>
                       <span>HR: <strong class="text-gray-700 dark:text-gray-300">{{ vital.heart_rate }}</strong></span>
                       <span>Temp: <strong class="text-gray-700 dark:text-gray-300">{{ vital.temperature }}</strong></span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class PatientDetailComponent implements OnInit {
  @Input() data: any;
  modalRef!: ModalRef;
  
  vitals = { blood_pressure: '', heart_rate: '', temperature: '', oxygen_saturation: '' };
  vitalsHistory: any[] = [];
  loading = false;

  constructor(private nurseService: NurseService) {}

  ngOnInit(): void {
    if (this.data && this.data._id) {
        this.loadVitalsHistory();
    }
  }

  loadVitalsHistory() {
    this.nurseService.getPatientDetails(this.data._id).subscribe({
      next: (res: any) => {
        const medicalHistory = res?.data?.medical_history || [];
        this.vitalsHistory = medicalHistory
          .filter((entry: any) => entry.diagnosis === 'Vital Signs Check')
          .map((entry: any) => {
             // Safe parsing
             let parsed = {};
             try { parsed = typeof entry.treatment === 'string' ? JSON.parse(entry.treatment) : entry.treatment; } catch(e){}
             return { ...parsed, date: entry.date_time };
          });
      }
    });
  }

  addVitals() {
    this.loading = true;
    this.nurseService.addPatientVitals(this.data._id, this.vitals).subscribe({
      next: () => {
        this.vitalsHistory.unshift({
          ...this.vitals,
          date: new Date().toISOString()
        });
        this.resetForm();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to save vitals');
      }
    });
  }

  resetForm() {
    this.vitals = { blood_pressure: '', heart_rate: '', temperature: '', oxygen_saturation: '' };
  }

  close() {
    this.modalRef.close();
  }
}
