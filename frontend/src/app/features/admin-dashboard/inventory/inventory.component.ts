import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from './inventory.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ModalService } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
           <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400">Track medicine stock and equipment</p>
        </div>
        <button
          (click)="openInventoryDialog()"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30"
        >
          <span class="material-icons text-xl">add</span>
          <span class="font-medium">Add Item</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex gap-4">
        <div class="relative w-full md:w-96">
          <input
            type="text"
            (keyup)="applyFilter($event)"
            placeholder="Search inventory..."
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
          <span class="material-icons absolute left-3 top-3.5 text-gray-400">search</span>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" *ngIf="!loading">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Item Name</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Category</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Stock</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Unit Price</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr *ngFor="let item of filteredInventory" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <!-- Name -->
                <td class="p-4">
                  <span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                </td>
                
                <!-- Category -->
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                    {{ item.category }}
                  </span>
                </td>

                <!-- Stock -->
                <td class="p-4">
                  <div class="flex items-center gap-2">
                     <span [class]="'font-bold ' + (item.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-200')">
                       {{ item.stock }}
                     </span>
                     <span *ngIf="item.stock < 10" class="text-xs text-red-500">(Low)</span>
                  </div>
                </td>

                <!-- Price -->
                <td class="p-4">
                   <span class="text-gray-900 dark:text-gray-200">\${{ item.price }}</span>
                </td>

                <!-- Actions -->
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openInventoryDialog(item)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                       <span class="material-icons text-[20px]">edit</span>
                    </button>
                    <button (click)="confirmDelete(item)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                       <span class="material-icons text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty State -->
              <tr *ngIf="filteredInventory.length === 0">
                 <td colspan="5" class="p-8 text-center text-gray-500 dark:text-gray-400">
                    No items found.
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  inventory: any[] = [];
  filteredInventory: any[] = [];
  loading = false;

  constructor(
    private inventoryService: InventoryService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.loading = true;
    this.inventoryService.getInventoryList().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.inventory = data;
        this.filteredInventory = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load inventory', err);
        this.loading = false;
      }
    });
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (!filterValue) {
      this.filteredInventory = this.inventory;
    } else {
      this.filteredInventory = this.inventory.filter((item: any) => 
         item.name?.toLowerCase().includes(filterValue) || 
         item.category?.toLowerCase().includes(filterValue)
      );
    }
  }

  openInventoryDialog(item?: any) {
    // Placeholder for Inventory Edit Dialog logic (Assume mostly same as User logic)
    // For now logging
    console.log('Open Inventory Dialog', item);
  }

  confirmDelete(item: any) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete ${item.name}?`,
      }
    });

    modalRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading = true;
        this.inventoryService.deleteInventoryItem(item._id).subscribe({
          next: () => {
             this.inventory = this.inventory.filter(i => i._id !== item._id);
             this.filteredInventory = [...this.inventory];
             this.loading = false;
          },
          error: (err: any) => {
             console.error('Delete failed', err);
             this.loading = false;
          }
        });
      }
    });
  }
}