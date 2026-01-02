import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from './inventory.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ModalService } from 'src/app/shared/ui/modal.service';
import { InventoryFormDialogComponent } from './inventory-form-dialog.component';
import { ConsumeStockDialogComponent } from './consume-stock-dialog.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Track medicine stock, equipment, and consumption</p>
        </div>
        <button
          (click)="openInventoryDialog()"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30"
          >
          <span class="material-icons text-xl">add</span>
          <span class="font-medium">Add Item</span>
        </button>
      </div>
    
      <!-- Filters & Tabs -->
      <div class="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <!-- Tabs -->
        <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button (click)="setFilter('all')" [class]="getTabClass('all')" class="px-4 py-2 rounded-lg text-sm font-medium transition-all">All Items</button>
            <button (click)="setFilter('low_stock')" [class]="getTabClass('low_stock')" class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                Low Stock
                <span *ngIf="lowStockCount > 0" class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ lowStockCount }}</span>
            </button>
            <button (click)="setFilter('expired')" [class]="getTabClass('expired')" class="px-4 py-2 rounded-lg text-sm font-medium transition-all">Expiring Soon</button>
        </div>

        <!-- Search -->
        <div class="relative w-full md:w-80">
          <input
            type="text"
            (keyup)="applySearch($event)"
            placeholder="Search inventory..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
          </div>
        </div>
    
        <!-- Loading -->
        @if (loading) {
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
    
        <!-- Table -->
        @if (!loading) {
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Item Name</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Type/Category</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Stock</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Expiry</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  @for (item of filteredInventory; track item) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <!-- Name -->
                      <td class="p-4">
                        <div class="flex flex-col">
                            <span class="font-bold text-gray-900 dark:text-white">{{ item.name }}</span>
                            <span class="text-xs text-gray-500">{{ item.supplier_info?.name || 'No Supplier' }}</span>
                        </div>
                      </td>
                      <!-- Category -->
                      <td class="p-4">
                        <div class="flex flex-col">
                            <span class="text-sm text-gray-800 dark:text-gray-200 capitalize">{{ item.type }}</span>
                            <span class="text-xs text-gray-500">{{ item.category || '-' }}</span>
                        </div>
                      </td>
                      <!-- Status -->
                      <td class="p-4">
                        <span [class]="getStatusClass(item)">
                          {{ (item.status || 'Active') | titlecase }}
                        </span>
                      </td>
                      <!-- Stock -->
                      <td class="p-4">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-gray-900 dark:text-gray-200">{{ item.quantity_available }}</span>
                          <span class="text-xs text-gray-400">/ {{ item.minimum_required }} min</span>
                        </div>
                         <!-- Progress bar -->
                         <div class="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                            <div class="h-full rounded-full" 
                                [style.width.%]="(item.quantity_available / (item.minimum_required * 2)) * 100"
                                [ngClass]="{
                                    'bg-red-500': item.quantity_available <= item.minimum_required,
                                    'bg-green-500': item.quantity_available > item.minimum_required
                                }"></div>
                         </div>
                      </td>
                      <!-- Expiry -->
                      <td class="p-4">
                        <span class="text-sm" [ngClass]="getExpiryClass(item.expiry_date)">
                            {{ item.expiry_date ? (item.expiry_date | date:'mediumDate') : 'N/A' }}
                        </span>
                      </td>
                      <!-- Actions -->
                      <td class="p-4 text-right">
                        <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button (click)="openConsumeDialog(item)" class="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Consume Stock">
                             <span class="material-icons text-[20px]">remove_circle_outline</span>
                          </button>
                          <button (click)="openInventoryDialog(item)" class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                            <span class="material-icons text-[20px]">edit</span>
                          </button>
                          <button (click)="confirmDelete(item)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                            <span class="material-icons text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                  <!-- Empty State -->
                  @if (filteredInventory.length === 0) {
                    <tr>
                      <td colspan="6" class="p-12 text-center">
                         <div class="flex flex-col items-center justify-center text-gray-400">
                            <span class="material-icons text-4xl mb-2">inventory_2</span>
                            <p>No items found matching your criteria.</p>
                         </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    `
})
export class InventoryComponent implements OnInit {
  inventory: any[] = [];
  filteredInventory: any[] = [];
  loading = false;
  activeFilter: 'all' | 'low_stock' | 'expired' = 'all';
  searchQuery = '';

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
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load inventory', err);
        this.loading = false;
      }
    });
  }

  get lowStockCount() {
      return this.inventory.filter(i => i.quantity_available <= i.minimum_required).length;
  }

  setFilter(filter: 'all' | 'low_stock' | 'expired') {
      this.activeFilter = filter;
      this.applyFilters();
  }

  applySearch(event: any) {
      this.searchQuery = (event.target as HTMLInputElement).value.toLowerCase().trim();
      this.applyFilters();
  }

  applyFilters() {
      let data = [...this.inventory];

      // Tab Filter
      if (this.activeFilter === 'low_stock') {
          data = data.filter(i => i.quantity_available <= i.minimum_required);
      } else if (this.activeFilter === 'expired') {
          const now = new Date();
          data = data.filter(i => i.expiry_date && new Date(i.expiry_date) < now);
      }

      // Search Filter
      if (this.searchQuery) {
          data = data.filter(i => 
              i.name?.toLowerCase().includes(this.searchQuery) || 
              i.category?.toLowerCase().includes(this.searchQuery) ||
              i.type?.toLowerCase().includes(this.searchQuery)
          );
      }

      this.filteredInventory = data;
  }

  openInventoryDialog(item?: any) {
    const ref = this.modalService.open(InventoryFormDialogComponent, { data: item });
    ref.afterClosed().subscribe(result => {
        if (result) {
            this.loading = true;
            if (item) {
                // Edit
                this.inventoryService.updateInventoryItem(item._id, result).subscribe({
                    next: () => this.loadInventory(),
                    error: () => this.loading = false
                });
            } else {
                // Add
                this.inventoryService.addInventoryItem(result).subscribe({
                    next: () => this.loadInventory(),
                    error: () => this.loading = false
                });
            }
        }
    });
  }

  openConsumeDialog(item: any) {
      const ref = this.modalService.open(ConsumeStockDialogComponent, { data: item });
      ref.afterClosed().subscribe(result => {
          if (result) {
              this.loading = true;
              this.inventoryService.consumeStock(item._id, result).subscribe({
                  next: () => {
                      alert(`Consumed ${result.quantity} ${item.type === 'medicine' ? 'units' : 'items'} of ${item.name}`);
                      this.loadInventory();
                  },
                  error: (err) => {
                      alert('Failed to consume stock: ' + (err.error?.message || err.message));
                      this.loading = false;
                  }
              });
          }
      });
  }

  confirmDelete(item: any) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      }
    });

    modalRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading = true;
        this.inventoryService.deleteInventoryItem(item._id).subscribe({
          next: () => {
             this.inventory = this.inventory.filter(i => i._id !== item._id);
             this.applyFilters();
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

  // Helpers for template
  getTabClass(tab: string) {
      const activeBase = 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm';
      const inactiveBase = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
      return this.activeFilter === tab ? activeBase : inactiveBase;
  }

  getStatusClass(item: any) {
      const base = 'px-2.5 py-1 rounded-full text-xs font-medium ';
      if (item.status === 'out_of_stock' || item.quantity_available === 0) return base + 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      if (item.status === 'low_stock' || item.quantity_available <= item.minimum_required) return base + 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      if (item.status === 'expired') return base + 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      return base + 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  }

  getExpiryClass(date: any) {
      if (!date) return 'text-gray-900 dark:text-gray-200';
      const daysUntil = (new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      if (daysUntil < 0) return 'text-red-600 font-bold';
      if (daysUntil < 30) return 'text-orange-500 font-medium';
      return 'text-gray-900 dark:text-gray-200';
  }
}