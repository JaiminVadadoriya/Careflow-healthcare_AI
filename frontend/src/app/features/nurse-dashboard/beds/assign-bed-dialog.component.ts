import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-assign-bed-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[350px] overflow-hidden border border-gray-100 dark:border-gray-700 font-sans">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Assign Bed</h2>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="p-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient ID</label>
        <input 
           type="text" 
           [(ngModel)]="patientId" 
           placeholder="Enter Patient ID"
           class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
        <button (click)="close()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm">Cancel</button>
        <button 
           (click)="assign()" 
           [disabled]="!patientId.trim()" 
           class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
           Assign
        </button>
      </div>
    </div>
  `
})
export class AssignBedDialogComponent {
  patientId = '';
  modalRef!: ModalRef;

  constructor() {}

  assign() {
    this.modalRef.close(this.patientId.trim());
  }

  close() {
    this.modalRef.close();
  }
}
