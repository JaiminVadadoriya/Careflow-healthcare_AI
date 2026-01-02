import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NurseService } from '../nurse.service';


@Component({
  selector: 'app-patient-care',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-fade-in" *ngIf="patient">
      <!-- Header -->
      <div class="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
                {{ patient.full_name?.charAt(0) }}
            </div>
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ patient.full_name }}</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ patient.custom_id || patient._id }} | Age: {{ calculateAge(patient.date_of_birth) }} | Blood: {{ patient.blood_group || 'N/A' }}</p>
            </div>
        </div>
        <div class="flex gap-3">
             <span class="px-3 py-1 rounded-full text-sm font-medium" 
                [ngClass]="{
                    'bg-green-100 text-green-700': patient.current_status === 'admitted',
                    'bg-yellow-100 text-yellow-700': patient.current_status === 'active', 
                    'bg-gray-100 text-gray-700': patient.current_status === 'discharged'
                }">
                {{ patient.current_status | titlecase }}
             </span>
             <button routerLink="/nurse/patients" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons text-gray-500">close</span>
             </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-800">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button (click)="activeTab = 'overview'" [class]="getTabClass('overview')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">info</span> Overview
          </button>
          <button (click)="activeTab = 'vitals'" [class]="getTabClass('vitals')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">monitor_heart</span> Vitals
          </button>
          <button (click)="activeTab = 'orders'" [class]="getTabClass('orders')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">receipt_long</span> Dr. Orders
          </button>
          <button (click)="activeTab = 'notes'" [class]="getTabClass('notes')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">edit_note</span> Nursing Notes
          </button>
        </nav>
      </div>

      <!-- Tab Content: Overview -->
      <div *ngIf="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <!-- Basic Info -->
         <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 class="font-semibold text-lg mb-4">Patient Details</h3>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between"><span class="text-gray-500">Phone</span> <span>{{ patient.contact_info?.phone }}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Email</span> <span>{{ patient.email }}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Address</span> <span class="text-right truncate max-w-[200px]">{{ patient.contact_info?.address }}</span></div>
                <div class="flex justify-between"><span class="text-gray-500">Emergency Contact</span> <span>{{ patient.emergency_contact?.name || 'N/A' }}</span></div>
            </div>
         </div>
         
         <!-- Medical History -->
         <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-2">
            <h3 class="font-semibold text-lg mb-4">Latest Diagnosis</h3>
            <div *ngIf="patient.medical_history?.length; else noHistory">
                <div *ngFor="let record of patient.medical_history.slice(0, 3)" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div class="flex justify-between mb-1">
                        <span class="font-bold text-gray-800 dark:text-gray-200">{{ record.diagnosis }}</span>
                        <span class="text-xs text-gray-500">{{ record.date_time | date:'mediumDate' }}</span>
                    </div>
                </div>
            </div>
            <ng-template #noHistory>
                <p class="text-gray-500 italic">No medical history available.</p>
            </ng-template>
         </div>
      </div>

      <!-- Tab Content: Vitals -->
      <div *ngIf="activeTab === 'vitals'" class="space-y-6">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h3 class="font-semibold text-lg mb-4">Record New Vitals</h3>
             <form [formGroup]="vitalsForm" (ngSubmit)="submitVitals()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BP (mmHg) <span class="text-red-500">*</span></label>
                    <input type="text" formControlName="blood_pressure" placeholder="120/80" 
                           [class.border-red-500]="isFieldInvalid('blood_pressure')"
                           class="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 py-2.5 px-4 text-sm transition-colors">
                    <p *ngIf="isFieldInvalid('blood_pressure')" class="text-xs text-red-500 mt-1">Required (e.g., 120/80)</p>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heart Rate (bpm) <span class="text-red-500">*</span></label>
                    <input type="number" formControlName="heart_rate" placeholder="72" 
                           [class.border-red-500]="isFieldInvalid('heart_rate')"
                           class="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 py-2.5 px-4 text-sm transition-colors">
                    <p *ngIf="isFieldInvalid('heart_rate')" class="text-xs text-red-500 mt-1">Required (number)</p>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temp (°C) <span class="text-red-500">*</span></label>
                    <input type="number" formControlName="temperature" placeholder="36.6" 
                           [class.border-red-500]="isFieldInvalid('temperature')"
                           class="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 py-2.5 px-4 text-sm transition-colors">
                    <p *ngIf="isFieldInvalid('temperature')" class="text-xs text-red-500 mt-1">Required (number)</p>
                </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SpO2 (%) <span class="text-red-500">*</span></label>
                    <input type="number" formControlName="oxygen_saturation" placeholder="98" 
                           [class.border-red-500]="isFieldInvalid('oxygen_saturation')"
                           class="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 py-2.5 px-4 text-sm transition-colors">
                    <p *ngIf="isFieldInvalid('oxygen_saturation')" class="text-xs text-red-500 mt-1">Required (number)</p>
                </div>
                <div class="lg:col-span-4 mt-2 flex justify-end">
                    <button type="submit" [disabled]="submitting" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                        <span *ngIf="submitting" class="material-icons animate-spin text-sm">autorenew</span>
                        {{ submitting ? 'Saving...' : 'Save Vitals' }}
                    </button>
                </div>
             </form>
          </div>
          
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h3 class="font-semibold text-lg mb-4">Vitals History</h3>
             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                   <thead class="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                         <th class="p-3 font-semibold text-gray-500">Date/Time</th>
                         <th class="p-3 font-semibold text-gray-500">BP</th>
                         <th class="p-3 font-semibold text-gray-500">Heart Rate</th>
                         <th class="p-3 font-semibold text-gray-500">Temp</th>
                         <th class="p-3 font-semibold text-gray-500">SpO2</th>
                         <th class="p-3 font-semibold text-gray-500">Recorded By</th>
                      </tr>
                   </thead>
                   <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                      <tr *ngFor="let record of vitalsHistory" class="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                         <td class="p-3 text-gray-900 dark:text-gray-300">{{ record.createdAt | date:'medium' }}</td>
                         <td class="p-3 text-gray-900 dark:text-gray-300">{{ parseVitals(record.treatment).blood_pressure }}</td>
                         <td class="p-3 text-gray-900 dark:text-gray-300">{{ parseVitals(record.treatment).heart_rate }} bpm</td>
                         <td class="p-3 text-gray-900 dark:text-gray-300">{{ parseVitals(record.treatment).temperature }} °C</td>
                         <td class="p-3 text-gray-900 dark:text-gray-300">{{ parseVitals(record.treatment).oxygen_saturation }}%</td>
                         <td class="p-3 text-gray-500 text-xs">{{ record.doctor?.full_name || 'Nurse' }}</td>
                      </tr>
                      <tr *ngIf="!vitalsHistory.length">
                         <td colspan="6" class="p-8 text-center text-gray-500">No vitals recorded yet.</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
      </div>

      <!-- Tab Content: Orders -->
      <div *ngIf="activeTab === 'orders'" class="space-y-6">
         <div *ngIf="orders.length; else noOrders" class="space-y-4">
            <div *ngFor="let order of orders" class="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400">
                    <span class="material-icons">medication</span>
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 dark:text-white">{{ order.diagnosis }}</h4> <!-- Using diagnosis as title for now -->
                     <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ order.treatment }}</p>
                     <div class="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <span class="material-icons text-[14px]">person</span> Dr. {{ order.doctor?.full_name || 'Unknown' }}
                        <span class="material-icons text-[14px] ml-2">schedule</span> {{ order.createdAt | date:'short' }}
                     </div>
                </div>
            </div>
         </div>
         <ng-template #noOrders>
            <div class="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <span class="material-icons text-gray-400 text-4xl mb-2">assignment_turned_in</span>
                <p class="text-gray-500">No active doctor orders found.</p>
            </div>
         </ng-template>
      </div>

      <!-- Tab Content: Notes -->
      <div *ngIf="activeTab === 'notes'" class="space-y-6">
         <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h3 class="font-semibold text-lg mb-4">Add Nursing Note</h3>
             <div class="flex flex-col gap-3">
                 <textarea [(ngModel)]="newNote" placeholder="Enter patient clinical notes, observations, or care details..." rows="3" class="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 p-4 text-sm"></textarea>
                 <div class="flex justify-end">
                     <button (click)="addNote()" [disabled]="!newNote.trim() || submitting" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50">
                         Post Note
                     </button>
                 </div>
             </div>
         </div>

         <div class="space-y-4">
             <h3 class="font-semibold text-gray-700 dark:text-gray-300 px-1">History</h3>
             <div *ngFor="let note of nursingNotes" class="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ note.treatment }}</p>
                <p class="text-xs text-gray-400 mt-3">{{ note.createdAt | date:'medium' }}</p>
             </div>
             <div *ngIf="!nursingNotes.length" class="text-center p-8 text-gray-500 italic">No notes recorded yet.</div>
         </div>
      </div>
    </div>
  `
})
export class PatientCareComponent implements OnInit {
  patientId: string | null = null;
  patient: any = null;
  activeTab: 'overview' | 'vitals' | 'orders' | 'notes' = 'overview';
  
  vitalsForm: FormGroup;
  orders: any[] = [];
  nursingNotes: any[] = [];
  vitalsHistory: any[] = [];
  newNote: string = '';
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private nurseService: NurseService,
    private fb: FormBuilder
  ) {
    this.vitalsForm = this.fb.group({
      blood_pressure: ['', Validators.required],
      heart_rate: ['', Validators.required],
      temperature: ['', Validators.required],
      oxygen_saturation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('id');
      if (this.patientId) {
        this.loadPatientData();
        this.loadOrders();
        this.loadNotes();
        this.loadVitals();
      }
    });
  }

  loadPatientData() {
    if (!this.patientId) return;
    this.nurseService.getPatientDetails(this.patientId).subscribe({
      next: (res) => this.patient = res.data,
      error: (err) => console.error('Failed to load patient', err)
    });
  }

  loadVitals() {
    if (!this.patientId) return;
    this.nurseService.getPatientVitals(this.patientId).subscribe({
      next: (res) => this.vitalsHistory = res.data,
      error: (err) => console.error(err)
    });
  }

  parseVitals(treatmentString: string): any {
     try {
         return JSON.parse(treatmentString);
     } catch (e) {
         return {};
     }
  }

  loadOrders() {
    if (!this.patientId) return;
    this.nurseService.getDoctorOrders(this.patientId).subscribe({
      next: (res) => this.orders = res.data,
      error: (err) => console.error(err)
    });
  }

  loadNotes() {
    if (!this.patientId) return;
    this.nurseService.getNursingNotes(this.patientId).subscribe({
      next: (res) => this.nursingNotes = res.data,
      error: (err) => console.error(err)
    });
  }

  submitVitals() {
    if (this.vitalsForm.invalid) {
      this.vitalsForm.markAllAsTouched();
      return;
    }
    if (!this.patientId) return;

    this.submitting = true;
    this.nurseService.addPatientVitals(this.patientId, this.vitalsForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.vitalsForm.reset();
        alert('Vitals saved successfully!');
        this.loadVitals();
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        alert('Failed to save vitals');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vitalsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  addNote() {
    if (!this.newNote.trim() || !this.patientId) return;
    this.submitting = true;
    this.nurseService.addNursingNote(this.patientId, this.newNote).subscribe({
      next: () => {
        this.submitting = false;
        this.newNote = '';
        this.loadNotes(); // Refresh list
      },
      error: (err) => {
        console.error(err);
        this.submitting = false;
        alert('Failed to add note');
      }
    });
  }

  calculateAge(dob: string): string {
    if (!dob) return 'N/A';
    const ageDiffMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  }

  getTabClass(tab: string) {
    const baseClass = 'transition-colors duration-200 ease-in-out px-1 pb-4 text-sm font-medium';
    return this.activeTab === tab
      ? `border-blue-500 text-blue-600 dark:text-blue-500 border-b-2 ${baseClass}`
      : `border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 ${baseClass}`;
  }
}
