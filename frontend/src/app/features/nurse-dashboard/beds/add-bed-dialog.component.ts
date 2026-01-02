import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-add-bed-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="material-icons text-blue-500">add_box</span>
          Add New Bed
        </h2>
        <button (click)="close()" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
          <span class="material-icons text-gray-500 dark:text-gray-400 text-sm">close</span>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="form" class="p-6 space-y-4 overflow-y-auto">
        <!-- Room Number -->
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
           <input type="text" formControlName="room_number" placeholder="e.g. 101-A"
                  class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
           @if (form.get('room_number')?.touched && form.get('room_number')?.invalid) {
             <p class="text-xs text-red-500 mt-1">Room number is required</p>
           }
        </div>

        <!-- Ward -->
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ward</label>
           <select formControlName="ward" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
             <option value="">Select Ward</option>
             <option value="general">General Ward</option>
             <option value="icu">ICU</option>
             <option value="isolation">Isolation</option>
           </select>
           @if (form.get('ward')?.touched && form.get('ward')?.invalid) {
             <p class="text-xs text-red-500 mt-1">Please select a ward</p>
           }
        </div>

        <!-- Bed Type -->
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bed Type</label>
           <select formControlName="bed_type" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
             <option value="">Select Type</option>
             <option value="standard">Standard Bed</option>
             <option value="icu">ICU Bed</option>
             <option value="isolation">Isolation Bed</option>
           </select>
           @if (form.get('bed_type')?.touched && form.get('bed_type')?.invalid) {
             <p class="text-xs text-red-500 mt-1">Please select a bed type</p>
           }
        </div>
      </form>

      <!-- Footer -->
      <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
        <button (click)="close()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm">Cancel</button>
        <button 
           (click)="submit()" 
           [disabled]="form.invalid"
           class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30">
           Add Bed
        </button>
      </div>
    </div>
  `
})
export class AddBedDialogComponent {
  form: FormGroup;
  modalRef!: ModalRef;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      room_number: ['', Validators.required],
      ward: ['', Validators.required],
      bed_type: ['', Validators.required]
    });
  }

  close() {
    this.modalRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.modalRef.close(this.form.value);
    } else {
        this.form.markAllAsTouched();
    }
  }
}
