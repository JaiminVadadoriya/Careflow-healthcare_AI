import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from '../ui/modal.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-100 dark:border-gray-700">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm</h2>
        <p class="mb-6 text-gray-600 dark:text-gray-300">{{ data?.message }}</p>
        <div class="flex gap-3 justify-end">
          <button (click)="onCancel()" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button (click)="onConfirm()" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">Delete</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() data: any;
  modalRef!: ModalRef;

  onConfirm() {
    this.modalRef.close(true);
  }

  onCancel() {
    this.modalRef.close(false);
  }
} 