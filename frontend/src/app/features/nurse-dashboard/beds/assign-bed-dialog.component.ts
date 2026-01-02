import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NurseService } from '../nurse.service';
import { ModalRef } from 'src/app/shared/ui/modal.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-assign-bed-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[400px] overflow-hidden border border-gray-100 dark:border-gray-700 font-sans flex flex-col max-h-[85vh]">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Assign Bed</h2>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="p-6 flex flex-col gap-4">
        <!-- Search Input -->
        <div class="relative">
             <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Patient</label>
             <div class="relative">
                 <span class="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
                 <input 
                   type="text" 
                   [formControl]="searchControl"
                   placeholder="Type name or ID..."
                   class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 />
             </div>
        </div>

        <!-- Create Patient Helper -->
        <div class="text-xs text-gray-500 dark:text-gray-400 px-1">
           Search for a patient to assign. 
        </div>

        <!-- Results List -->
        <div class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800">
           @if (loading) {
              <div class="p-4 text-center text-gray-500">
                  <div class="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mx-auto mb-2"></div>
                  Searching...
              </div>
           }
           
           @if (!loading && patients.length > 0) {
              @for (patient of patients; track patient._id) {
                 <button 
                    (click)="selectPatient(patient)"
                    [class.bg-blue-50]="selectedPatient?._id === patient._id"
                    [class.dark:bg-blue-900/20]="selectedPatient?._id === patient._id"
                    class="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors border-b last:border-0 border-gray-100 dark:border-gray-800">
                    
                    <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
                        {{ patient.full_name?.charAt(0) || 'P' }}
                    </div>
                    
                    <div>
                        <div class="font-medium text-gray-900 dark:text-white">{{ patient.full_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {{ patient._id }}</div>
                    </div>

                    @if (selectedPatient?._id === patient._id) {
                        <span class="material-icons text-blue-500 ml-auto text-sm">check_circle</span>
                    }
                 </button>
              }
           }

           @if (!loading && patients.length === 0 && searchControl.value) {
               <div class="p-6 text-center text-gray-400 text-sm">
                   No patients found.
               </div>
           }
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 mt-auto">
        <button (click)="close()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm">Cancel</button>
        <button 
           (click)="assign()" 
           [disabled]="!selectedPatient" 
           class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
           Assign Bed
        </button>
      </div>
    </div>
  `
})
export class AssignBedDialogComponent {
  searchControl = this.fb.control('');
  patients: any[] = [];
  selectedPatient: any = null;
  loading = false;
  modalRef!: ModalRef;

  constructor(
      private fb: FormBuilder,
      private nurseService: NurseService
  ) {
      this.setupSearch();
  }

  setupSearch() {
      this.searchControl.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term => {
              this.loading = true;
              return this.nurseService.getAllPatients(term || '');
          })
      ).subscribe({
          next: (res: any) => {
              this.patients = res.data || res;
              this.loading = false;
          },
          error: () => {
              this.loading = false;
              this.patients = [];
          }
      });
      
      // Initial load
      this.loading = true;
      this.nurseService.getAllPatients('').subscribe({
          next: (res: any) => {
              this.patients = res.data || res;
              this.loading = false;
          },
          error: () => this.loading = false
      });
  }

  selectPatient(patient: any) {
      this.selectedPatient = patient;
  }

  assign() {
    if (this.selectedPatient) {
        this.modalRef.close(this.selectedPatient._id);
    }
  }

  close() {
    this.modalRef.close();
  }
}
