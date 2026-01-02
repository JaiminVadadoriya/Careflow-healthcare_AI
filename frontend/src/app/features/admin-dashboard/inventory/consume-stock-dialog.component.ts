import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-consume-stock-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[400px] overflow-hidden border border-gray-100 dark:border-gray-700 font-sans">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Consume Stock</h2>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-4">
            <h3 class="font-bold text-gray-900 dark:text-white">{{ data?.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Available: <span class="font-bold text-blue-600 dark:text-blue-400">{{ data?.quantity_available }}</span></p>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity to Use</label>
            <input type="number" [(ngModel)]="quantity" min="1" [max]="data?.quantity_available" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
            <textarea [(ngModel)]="reason" rows="2" placeholder="e.g. Patient Administration, Broken, Expired..." class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
        <button (click)="close()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm">Cancel</button>
        <button 
           (click)="confirm()" 
           [disabled]="!quantity || quantity <= 0 || quantity > data?.quantity_available" 
           class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
           Consume
        </button>
      </div>
    </div>
  `
})
export class ConsumeStockDialogComponent {
  data: any; // Injected data (was item)
  quantity: number = 1;
  reason: string = '';
  modalRef!: ModalRef;

  constructor() {}

  confirm() {
    this.modalRef.close({ quantity: this.quantity, reason: this.reason });
  }

  close() {
    this.modalRef.close();
  }
}
