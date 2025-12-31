import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Inventory Management</h2>
        <button mat-raised-button color="primary" (click)="resetForm()" [disabled]="loading">
          <mat-icon>add</mat-icon>
          Add New Item
        </button>
      </div>

      <!-- Add/Edit Form -->
      <mat-card class="mb-6" *ngIf="showForm">
        <mat-card-header>
          <mat-card-title>{{ editMode ? 'Edit' : 'Add' }} Inventory Item</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="inventoryForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <mat-form-field >
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="inventoryForm.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field >
              <mat-label>Type</mat-label>
              <mat-select formControlName="type" required>
                <mat-option value="medicine">Medicine</mat-option>
                <mat-option value="equipment">Equipment</mat-option>
                <mat-option value="supplies">Supplies</mat-option>
              </mat-select>
              <mat-error *ngIf="inventoryForm.get('type')?.hasError('required')">Type is required</mat-error>
            </mat-form-field>

            <mat-form-field >
              <mat-label>Quantity Available</mat-label>
              <input matInput type="number" formControlName="quantity_available" required min="0">
              <mat-error *ngIf="inventoryForm.get('quantity_available')?.hasError('required')">Quantity is required</mat-error>
              <mat-error *ngIf="inventoryForm.get('quantity_available')?.hasError('min')">Quantity must be 0 or greater</mat-error>
            </mat-form-field>

            <mat-form-field >
              <mat-label>Minimum Required</mat-label>
              <input matInput type="number" formControlName="minimum_required" required min="0">
              <mat-error *ngIf="inventoryForm.get('minimum_required')?.hasError('required')">Minimum required is required</mat-error>
              <mat-error *ngIf="inventoryForm.get('minimum_required')?.hasError('min')">Minimum required must be 0 or greater</mat-error>
            </mat-form-field>

            <mat-form-field >
              <mat-label>Expiry Date</mat-label>
              <input matInput type="date" formControlName="expiry_date">
            </mat-form-field>

            <mat-form-field >
              <mat-label>Supplier Name</mat-label>
              <input matInput formControlName="supplier_name">
            </mat-form-field>

            <mat-form-field >
              <mat-label>Supplier Contact</mat-label>
              <input matInput formControlName="supplier_contact">
            </mat-form-field>

            <div class="flex gap-2 items-end">
              <button mat-raised-button color="primary" type="submit" [disabled]="inventoryForm.invalid || loading">
                <mat-icon *ngIf="loading" class="animate-spin">refresh</mat-icon>
                {{ editMode ? 'Update' : 'Add' }}
              </button>
              <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <mat-spinner></mat-spinner>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Inventory Table -->
      <mat-card *ngIf="!loading">
        <mat-card-content>
          <table mat-table [dataSource]="inventoryList" class="min-w-full">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let item">{{ item.name }}</td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let item">
                <span class="px-2 py-1 rounded text-xs font-medium"
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': item.type === 'medicine',
                        'bg-green-100 text-green-800': item.type === 'equipment',
                        'bg-yellow-100 text-yellow-800': item.type === 'supplies'
                      }">
                  {{ item.type | titlecase }}
                </span>
              </td>
            </ng-container>

            <!-- Quantity Column -->
            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantity</th>
              <td mat-cell *matCellDef="let item">
                <span [ngClass]="{'text-red-600 font-bold': item.quantity_available < item.minimum_required}">
                  {{ item.quantity_available }}
                </span>
                <span *ngIf="item.quantity_available < item.minimum_required" 
                      class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  Low Stock!
                </span>
              </td>
            </ng-container>

            <!-- Min Required Column -->
            <ng-container matColumnDef="minRequired">
              <th mat-header-cell *matHeaderCellDef>Min Required</th>
              <td mat-cell *matCellDef="let item">{{ item.minimum_required }}</td>
            </ng-container>

            <!-- Expiry Column -->
            <ng-container matColumnDef="expiry">
              <th mat-header-cell *matHeaderCellDef>Expiry Date</th>
              <td mat-cell *matCellDef="let item">
                {{ item.expiry_date ? (item.expiry_date | date:'yyyy-MM-dd') : '-' }}
              </td>
            </ng-container>

            <!-- Supplier Column -->
            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef>Supplier</th>
              <td mat-cell *matCellDef="let item">
                <div *ngIf="item.supplier_info?.name">
                  <div class="font-medium">{{ item.supplier_info.name }}</div>
                  <div class="text-xs text-gray-500">{{ item.supplier_info.contact }}</div>
                </div>
                <span *ngIf="!item.supplier_info?.name">-</span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button color="primary" (click)="editItem(item)" [disabled]="loading">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(item)" [disabled]="loading">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="inventoryList.length === 0" class="text-center py-8 text-gray-500">
            No inventory items found.
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryComponent implements OnInit {
  inventoryList: any[] = [];
  inventoryForm: FormGroup;
  editMode = false;
  editingId: string | null = null;
  loading = false;
  error = '';
  showForm = false;
  displayedColumns: string[] = ['name', 'type', 'quantity', 'minRequired', 'expiry', 'supplier', 'actions'];

  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      quantity_available: [0, [Validators.required, Validators.min(0)]],
      minimum_required: [0, [Validators.required, Validators.min(0)]],
      expiry_date: [''],
      supplier_name: [''],
      supplier_contact: ['']
    });
  }

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.loading = true;
    this.error = '';
    this.inventoryService.getInventoryList().pipe(
      catchError((err) => {
        this.error = err.error?.message || 'Failed to load inventory';
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
        return of({ data: [] });
      })
    ).subscribe((res: any) => {
      this.inventoryList = res.data || [];
      this.loading = false;
    });
  }

  onSubmit() {
    if (this.inventoryForm.valid) {
      this.loading = true;
      const formValue = this.inventoryForm.value;
      const payload = {
        name: formValue.name,
        type: formValue.type,
        quantity_available: formValue.quantity_available,
        minimum_required: formValue.minimum_required,
        expiry_date: formValue.expiry_date || undefined,
        supplier_info: {
          name: formValue.supplier_name,
          contact: formValue.supplier_contact
        }
      };

      if (this.editMode && this.editingId) {
        this.inventoryService.updateInventoryItem(this.editingId, payload).subscribe({
          next: (res: any) => {
            this.snackBar.open('Inventory item updated successfully', 'Close', { duration: 2000 });
            this.loadInventory();
            this.cancelEdit();
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to update inventory item', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.inventoryService.addInventoryItem(payload).subscribe({
          next: (res: any) => {
            this.snackBar.open('Inventory item added successfully', 'Close', { duration: 2000 });
            this.loadInventory();
            this.resetForm();
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to add inventory item', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    }
  }

  editItem(item: any) {
    this.editMode = true;
    this.editingId = item._id;
    this.showForm = true;
    this.inventoryForm.patchValue({
      name: item.name,
      type: item.type,
      quantity_available: item.quantity_available,
      minimum_required: item.minimum_required,
      expiry_date: item.expiry_date ? item.expiry_date.substring(0, 10) : '',
      supplier_name: item.supplier_info?.name || '',
      supplier_contact: item.supplier_info?.contact || ''
    });
  }

  confirmDelete(item: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete ${item.name}?` },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.inventoryService.deleteInventoryItem(item._id).subscribe({
          next: () => {
            this.snackBar.open('Inventory item deleted successfully', 'Close', { duration: 2000 });
            this.loadInventory();
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to delete inventory item', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.showForm = false;
    this.inventoryForm.reset();
  }

  resetForm() {
    this.editMode = false;
    this.editingId = null;
    this.showForm = true;
    this.inventoryForm.reset();
  }
} 