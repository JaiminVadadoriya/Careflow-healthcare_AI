import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit User' : 'Add User' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSave()" class="p-4 flex flex-col gap-4">
      <mat-form-field >
        <mat-label>Full Name</mat-label>
        <input matInput formControlName="full_name" required>
        <mat-icon matSuffix>person</mat-icon>
        <mat-error *ngIf="form.get('full_name')?.hasError('required')">Name is required</mat-error>
      </mat-form-field>
      
      <mat-form-field >
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" required type="email">
        <mat-icon matSuffix>email</mat-icon>
        <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
      </mat-form-field>
      
      <mat-form-field >
        <mat-label>Phone</mat-label>
        <input matInput formControlName="phone" type="tel">
        <mat-icon matSuffix>phone</mat-icon>
      </mat-form-field>
      
      <mat-form-field  *ngIf="!data">
        <mat-label>Password</mat-label>
        <input matInput formControlName="password" type="password" required>
        <mat-icon matSuffix>lock</mat-icon>
        <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
        <mat-error *ngIf="form.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
      </mat-form-field>
      
      <mat-form-field >
        <mat-label>Role</mat-label>
        <mat-select formControlName="role" required>
          <mat-option value="admin">Admin</mat-option>
          <mat-option value="doctor">Doctor</mat-option>
          <mat-option value="nurse">Nurse</mat-option>
          <mat-option value="receptionist">Receptionist</mat-option>
          <mat-option value="inventory">Inventory</mat-option>
        </mat-select>
        <mat-icon matSuffix>work</mat-icon>
        <mat-error *ngIf="form.get('role')?.hasError('required')">Role is required</mat-error>
      </mat-form-field>
      
      <mat-form-field >
        <mat-label>Status</mat-label>
        <mat-select formControlName="status" required>
          <mat-option value="active">Active</mat-option>
          <mat-option value="inactive">Inactive</mat-option>
        </mat-select>
        <mat-icon matSuffix>toggle_on</mat-icon>
        <mat-error *ngIf="form.get('status')?.hasError('required')">Status is required</mat-error>
      </mat-form-field>
      
      <div class="flex gap-2 justify-end mt-4">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
          <mat-icon *ngIf="loading" class="animate-spin">refresh</mat-icon>
          {{ data ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  `
})
export class UserEditDialogComponent {
  form: FormGroup;
  loading = false;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      full_name: [data?.full_name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || ''],
      password: [data ? '' : '', data ? [] : [Validators.required, Validators.minLength(6)]],
      role: [data?.role || '', Validators.required],
      status: [data?.status || 'active', Validators.required]
    });
  }
  
  onSave() {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      
      // Remove password if editing and password is empty
      if (this.data && !formData.password) {
        delete formData.password;
      }
      
      this.dialogRef.close(formData);
    }
  }
  
  onCancel() {
    this.dialogRef.close();
  }
}
