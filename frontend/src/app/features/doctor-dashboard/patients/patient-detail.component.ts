import { Component, Input, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[600px] overflow-hidden border border-gray-100 dark:border-gray-700 font-sans">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ data.full_name }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Patient Details</p>
        </div>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-icons">close</span>
        </button>
      </div>
    
      <!-- Body -->
      <div class="max-h-[80vh] overflow-y-auto p-6 space-y-6">
        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date of Birth</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ data.dob }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Patient ID</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ data._id }}</p>
          </div>
        </div>
    
        <!-- Medical History -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <span class="material-icons text-blue-500 text-sm">history</span>
            Medical History
          </h3>
          <ul class="space-y-2">
            @for (record of medicalHistory; track record) {
              <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                {{ record }}
              </li>
            }
          </ul>
        </div>
    
        <!-- Doctor's Notes -->
        <div>
          <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <span class="material-icons text-blue-500 text-sm">edit_note</span>
            Doctor's Note
          </h3>
          <textarea
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
            rows="4"
            [(ngModel)]="note"
          placeholder="Add clinical observation..."></textarea>
          <div class="flex justify-end mt-2">
            <button (click)="saveNote()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
    `
})
export class PatientDetailComponent implements OnInit {
  @Input() data: any;
  modalRef!: ModalRef;
  
  medicalHistory = [
    'Diabetes - 2015',
    'Hypertension - 2018',
    'Surgery - 2020'
  ]; // Replace with real data
  
  note = '';

  constructor() {}
  
  ngOnInit() {
    // If real data came with notes, load here
  }

  saveNote() {
    // TODO: Integrate with backend
    alert('Note saved!');
  }

  close() {
    this.modalRef.close();
  }
}