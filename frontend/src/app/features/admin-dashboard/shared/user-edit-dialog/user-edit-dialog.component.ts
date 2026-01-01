import { Component, Input, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[500px] overflow-hidden border border-gray-100 dark:border-gray-700 font-sans">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ data ? 'Edit User' : 'Add User' }}</h2>
        <button (click)="onCancel()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span class="material-icons">close</span>
        </button>
      </div>
    
      <!-- Body -->
      <div class="p-6">
        <form [formGroup]="userForm" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
            <input formControlName="full_name" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe">
            @if (userForm.get('full_name')?.touched && userForm.get('full_name')?.invalid) {
              <div class="text-red-500 text-xs mt-1">Name is required</div>
            }
          </div>
    
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
            <input formControlName="email" type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com">
            @if (userForm.get('email')?.touched && userForm.get('email')?.invalid) {
              <div class="text-red-500 text-xs mt-1">Valid email is required</div>
            }
          </div>
    
          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input formControlName="phone" type="tel" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+1 234 567 890">
          </div>
    
          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password {{ data ? '(Leave blank to keep current)' : '*' }}</label>
            <input formControlName="password" type="password" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            @if (userForm.get('password')?.touched && userForm.get('password')?.invalid) {
              <div class="text-red-500 text-xs mt-1">Password is required (min 6 chars)</div>
            }
          </div>
    
          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
            <div class="relative">
              <select formControlName="role" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                @for (r of roles; track r) {
                  <option [value]="r.value">{{ r.label }}</option>
                }
              </select>
              <span class="material-icons absolute right-3 top-2.5 text-gray-400 pointer-events-none text-sm">expand_more</span>
            </div>
          </div>
    
          <!-- Status -->
          <div class="flex items-center gap-3 pt-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <button type="button"
              (click)="toggleStatus()"
              [class]="'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ' + (userForm.get('status')?.value === 'active' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700')">
              <span [class]="'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ' + (userForm.get('status')?.value === 'active' ? 'translate-x-6' : 'translate-x-1')"></span>
            </button>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ userForm.get('status')?.value === 'active' ? 'Active' : 'Inactive' }}</span>
          </div>
    
        </form>
      </div>
    
      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
        <button (click)="onCancel()" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
        <button (click)="onSave()" [disabled]="userForm.invalid" class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30">
          {{ data ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
    `
})
export class UserEditDialogComponent implements OnInit {
  @Input() data: any;
  modalRef!: ModalRef;
  userForm: FormGroup;
  
  roles = [
    { value: 'admin', label: 'Admin'},
    { value: 'doctor', label: 'Doctor'},
    { value: 'nurse', label: 'Nurse'},
    { value: 'receptionist', label: 'Receptionist'},
    { value: 'inventory', label: 'Inventory'},
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: [''], // Validators added dynamically
      role: ['doctor', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.userForm.patchValue(this.data);
      // Logic: Password optional on edit
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // Logic: Password required on create
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  toggleStatus() {
     const current = this.userForm.get('status')?.value;
     this.userForm.patchValue({ status: current === 'active' ? 'inactive' : 'active' });
  }

  onSave() {
    if (this.userForm.valid) {
      const formData = { ...this.userForm.value };
      
      // Remove password if editing and password is empty
      if (this.data && !formData.password) {
        delete formData.password;
      }
      
      this.modalRef.close(formData);
    }
  }

  onCancel() {
    this.modalRef.close();
  }
}
