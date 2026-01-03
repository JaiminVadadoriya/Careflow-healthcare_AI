import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef } from 'src/app/shared/ui/modal.service';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[800px] h-[80vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700 font-sans transition-all">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10 shrink-0">
        <div class="flex items-center gap-4">
             <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                {{ data.full_name?.charAt(0) }}
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ data.full_name }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ data._id }} | {{ calculateAge(data.dob) }} yrs</p>
            </div>
        </div>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-white/50 rounded-lg">
          <span class="material-icons">close</span>
        </button>
      </div>
    
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700 px-6 shrink-0">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button (click)="activeTab = 'overview'" [class]="getTabClass('overview')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">info</span> Overview
          </button>
          <button (click)="activeTab = 'prescriptions'" [class]="getTabClass('prescriptions')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">prescriptions</span> Prescriptions
          </button>
          <button (click)="activeTab = 'labs'" [class]="getTabClass('labs')" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2">
            <span class="material-icons text-base">science</span> Lab Results
          </button>
        </nav>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-gray-900/10">
      
        <!-- Overview Tab -->
        <div *ngIf="activeTab === 'overview'" class="space-y-6">
            <!-- Basic Metrics -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Date of Birth</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ data.dob | date:'mediumDate' }}</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Gender</p>
                <p class="font-medium text-gray-900 dark:text-white capitalize">{{ data.gender }}</p>
              </div>
            </div>

            <!-- Medical History -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span class="material-icons text-blue-500 text-sm">history</span> Medical History
              </h3>
              <div *ngIf="data.medical_history?.length; else noHistory" class="space-y-3">
                  <div *ngFor="let record of data.medical_history" class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex justify-between">
                     <span class="text-gray-800 dark:text-gray-200 line-clamp-1">{{ record.diagnosis }}</span>
                     <span class="text-xs text-gray-500 whitespace-nowrap">{{ record.date_time | date:'shortDate' }}</span>
                  </div>
              </div>
              <ng-template #noHistory>
                 <p class="text-gray-500 italic text-sm">No medical history recorded.</p>
              </ng-template>
            </div>
            
            <!-- Quick Note -->
             <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-3 text-sm">Add Clinical Note</h3>
               <textarea [(ngModel)]="note" rows="3" class="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Quick observation..."></textarea>
               <div class="flex justify-end mt-2">
                 <button (click)="saveNote()" [disabled]="!note.trim()" class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors">Save Note</button>
               </div>
            </div>
        </div>

        <!-- Prescriptions Tab -->
        <div *ngIf="activeTab === 'prescriptions'" class="space-y-6">
            <!-- Add Prescription Form -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span class="material-icons text-green-500">add_circle</span> New Prescription
               </h3>
               <div class="space-y-3">
                  <div class="relative">
                     <span class="material-icons absolute left-3 top-3 text-gray-400">medication</span>
                     <input [(ngModel)]="newPrescription.medications" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Medications (e.g., Amoxicillin 500mg BID)">
                  </div>
                  <textarea [(ngModel)]="newPrescription.notes" rows="2" class="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" placeholder="Instructions / Notes"></textarea>
                  <div class="flex justify-end">
                     <button (click)="createPrescription()" [disabled]="!newPrescription.medications" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50">Create Prescription</button>
                  </div>
               </div>
            </div>

            <!-- List -->
             <div class="space-y-4">
               <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide px-1">History</h3>
               <div *ngFor="let item of prescriptions" class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                   <div class="flex justify-between items-start mb-2">
                      <span class="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded font-medium">Rx</span>
                      <span class="text-xs text-gray-500">{{ item.createdAt | date:'medium' }}</span>
                   </div>
                   <p class="font-medium text-gray-900 dark:text-white mb-1">{{ parseTreatment(item.treatment).medications }}</p>
                   <p class="text-sm text-gray-500 dark:text-gray-400 text-sm">{{ parseTreatment(item.treatment).notes }}</p>
                   <div class="mt-2 text-xs text-gray-400">Dr. {{ item.doctor?.full_name }}</div>
               </div>
               <div *ngIf="!prescriptions.length" class="text-center p-8 text-gray-400 italic">No prescriptions found.</div>
             </div>
        </div>

        <!-- Labs Tab -->
        <div *ngIf="activeTab === 'labs'" class="space-y-6">
             <!-- Order Lab -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span class="material-icons text-purple-500">science</span> Order Lab Test
               </h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input [(ngModel)]="newLabOrder.testName" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Test Name (e.g., CBC, Lipid Panel)">
                   <div class="relative">
                       <select [(ngModel)]="newLabOrder.priority" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-purple-500 outline-none appearance-none">
                           <option value="normal">Normal</option>
                           <option value="urgent">Urgent</option>
                           <option value="stat">STAT</option>
                       </select>
                       <span class="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none text-sm">expand_more</span>
                   </div>
               </div>
               <textarea [(ngModel)]="newLabOrder.notes" rows="2" class="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-3" placeholder="Clinical Indication / Notes"></textarea>
               <div class="flex justify-end">
                  <button (click)="orderLab()" [disabled]="!newLabOrder.testName" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50">Order Test</button>
               </div>
            </div>

            <!-- List -->
            <div class="space-y-4">
               <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide px-1">Orders History</h3>
               <div *ngFor="let item of labOrders" class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                   <div class="flex justify-between items-center mb-2">
                      <h4 class="font-semibold text-gray-900 dark:text-white">{{ parseTreatment(item.treatment).testName }}</h4>
                      <span [ngClass]="{
                          'bg-red-100 text-red-700': parseTreatment(item.treatment).priority === 'stat',
                          'bg-orange-100 text-orange-700': parseTreatment(item.treatment).priority === 'urgent',
                          'bg-blue-100 text-blue-700': parseTreatment(item.treatment).priority === 'normal'
                      }" class="px-2 py-0.5 rounded text-xs uppercase font-bold">{{ parseTreatment(item.treatment).priority }}</span>
                   </div>
                   <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ parseTreatment(item.treatment).notes }}</p>
                   <div class="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                       <span>Ordered: {{ item.createdAt | date:'short' }}</span>
                       <span class="capitalize">Status: {{ parseTreatment(item.treatment).status }}</span>
                   </div>
               </div>
               <div *ngIf="!labOrders.length" class="text-center p-8 text-gray-400 italic">No lab orders found.</div>
             </div>
        </div>

      </div>
    </div>
    `
})
export class PatientDetailComponent implements OnInit {
  @Input() data: any;
  modalRef!: ModalRef;
  activeTab: 'overview' | 'prescriptions' | 'labs' = 'overview';
  
  prescriptions: any[] = [];
  labOrders: any[] = [];
  
  note = '';
  newPrescription = { medications: '', notes: '' };
  newLabOrder = { testName: '', priority: 'normal', notes: '' };

  constructor(private doctorService: DoctorService) {}
  
  ngOnInit() {
    if (this.data?._id) {
        this.loadPrescriptions();
        this.loadLabOrders();
    }
  }

  loadPrescriptions() {
      this.doctorService.getPatientPrescriptions(this.data._id).subscribe({
          next: (res) => this.prescriptions = res.data,
          error: (err) => console.error(err)
      });
  }

  loadLabOrders() {
      this.doctorService.getPatientLabOrders(this.data._id).subscribe({
          next: (res) => this.labOrders = res.data,
          error: (err) => console.error(err)
      });
  }

  createPrescription() {
      this.doctorService.createPrescription({ 
          patientId: this.data._id, 
          ...this.newPrescription 
      }).subscribe({
          next: () => {
              this.newPrescription = { medications: '', notes: '' };
              this.loadPrescriptions();
              // alert('Prescription created');
          },
          error: (err) => alert('Failed to create prescription')
      });
  }

  orderLab() {
      this.doctorService.orderLabTest({ 
          patientId: this.data._id, 
          ...this.newLabOrder 
      }).subscribe({
          next: () => {
              this.newLabOrder = { testName: '', priority: 'normal', notes: '' };
              this.loadLabOrders();
              // alert('Lab test ordered');
          },
          error: (err) => alert('Failed to order lab test')
      });
  }

  saveNote() {
    this.doctorService.addNoteToPatient(this.data._id, { content: this.note }).subscribe({
        next: () => {
            this.note = '';
            alert('Note saved to history');
            this.loadPrescriptions(); // Refresh history as we save notes there for now
        },
        error: (err) => alert('Failed to save note')
    });
  }

  close() {
    this.modalRef.close();
  }

  parseTreatment(treatment: string): any {
      try {
          return JSON.parse(treatment);
      } catch (e) {
          return {};
      }
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