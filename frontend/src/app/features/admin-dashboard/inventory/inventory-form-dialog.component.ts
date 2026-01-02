import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-inventory-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 font-sans">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/10">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ isEdit ? 'Edit Item' : 'Add New Item' }}</h2>
        <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="p-6">
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name *</label>
                    <input type="text" formControlName="name" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                    <select formControlName="type" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                        <option value="medicine">Medicine</option>
                        <option value="equipment">Equipment</option>
                        <option value="consumable">Consumable</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <input type="text" formControlName="category" placeholder="e.g. Antibiotics" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <!-- Stock & Price -->
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl grid grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity *</label>
                    <input type="number" formControlName="quantity_available" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min. Required *</label>
                    <input type="number" formControlName="minimum_required" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Price ($)</label>
                    <input type="number" formControlName="unit_price" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="col-span-3">
                     <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input type="date" formControlName="expiry_date" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <!-- Supplier Info -->
            <div formGroupName="supplier_info" class="space-y-3">
                <h4 class="font-medium text-gray-900 dark:text-white border-b pb-1 dark:border-gray-700">Supplier Details</h4>
                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" formControlName="name" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
                        <input type="text" formControlName="contact" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                    </div>
                     <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" formControlName="email" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
            </div>
        </form>
      </div>

      <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
        <button (click)="close()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm">Cancel</button>
        <button 
           (click)="save()" 
           [disabled]="form.invalid" 
           class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
           {{ isEdit ? 'Update Item' : 'Create Item' }}
        </button>
      </div>
    </div>
  `
})
export class InventoryFormDialogComponent implements OnInit {
  data: any; // Injected data for edit
  isEdit = false;
  form: FormGroup;
  modalRef!: ModalRef;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
        name: ['', Validators.required],
        type: ['medicine', Validators.required],
        category: [''],
        quantity_available: [0, [Validators.required, Validators.min(0)]],
        minimum_required: [0, [Validators.required, Validators.min(0)]],
        unit_price: [0, [Validators.min(0)]],
        expiry_date: [null],
        supplier_info: this.fb.group({
            name: [''],
            contact: [''],
            email: ['', Validators.email]
        })
    });
  }

  ngOnInit() {
      if (this.data) {
          this.isEdit = true;
          // Format date for input if exists
          const date = this.data.expiry_date ? new Date(this.data.expiry_date).toISOString().split('T')[0] : null;
          this.form.patchValue({
              ...this.data,
              expiry_date: date
          });
      }
  }

  save() {
    if (this.form.valid) {
        this.modalRef.close(this.form.value);
    }
  }

  close() {
    this.modalRef.close();
  }
}
