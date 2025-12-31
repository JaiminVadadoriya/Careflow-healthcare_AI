import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from './users.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { UserEditDialogComponent } from '../shared/user-edit-dialog/user-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    CommonModule,
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">User Management</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="openUserDialog()"
          [disabled]="loading"
        >
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <mat-form-field  class="w-full md:w-1/3 mb-4">
        <mat-label>Search Users</mat-label>
        <input
          matInput
          (keyup)="applyFilter($event)"
          placeholder="Search by name, email, or role"
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <mat-spinner></mat-spinner>
      </div>

      <div
        *ngIf="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <div class="overflow-x-auto" *ngIf="!loading">
        <table
          mat-table
          [dataSource]="dataSource"
          class="min-w-full rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
        >
          <!-- Header Cell Styling -->
          <ng-container matColumnDef="name">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="bg-gray-100 dark:bg-gray-700 text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100"
            >
              Name
            </th>
            <td
              mat-cell
              *matCellDef="let user"
              class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
            >
              {{ user.full_name }}
            </td>
            <!-- Name -->
          </ng-container>
          <!-- Email -->
          <ng-container matColumnDef="email">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="bg-gray-100 dark:bg-gray-700 text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100"
            >
              Email
            </th>
            <td
              mat-cell
              *matCellDef="let user"
              class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
            >
              {{ user.email }}
            </td>
          </ng-container>
          <!-- Phone -->
          <ng-container matColumnDef="phone">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="bg-gray-100 dark:bg-gray-700 text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100"
            >
              Phone
            </th>
            <td
              mat-cell
              *matCellDef="let user"
              class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
            >
              {{ user.phone || 'N/A' }}
            </td>
          </ng-container>
          <!-- Role -->
          <ng-container matColumnDef="role">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="bg-gray-100 dark:bg-gray-700 text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100"
            >
              Role
            </th>
            <td
              mat-cell
              *matCellDef="let user"
              class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
            >
              <mat-select
                [(value)]="user.role"
                (selectionChange)="changeRole(user)"
                class="min-w-[150px]"
              >
                <mat-option *ngFor="let r of roles" [value]="r.value">
                  <mat-icon class="mr-2 text-sm">{{ r.icon }}</mat-icon>
                  {{ r.label }}
                </mat-option>
              </mat-select>
            </td>
          </ng-container>
          <!-- Status -->
          <ng-container matColumnDef="status">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="bg-gray-100 dark:bg-gray-700 text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100"
            >
              Status
            </th>
            <td
              mat-cell
              *matCellDef="let user"
              class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
            >
              <mat-slide-toggle
                [(ngModel)]="user.status"
                (change)="changeStatus(user)"
                class="!ml-2"
                [checked]="user.status === 'active'"
                color="primary"
              >
                {{ user.status === 'active' ? 'Active' : 'Inactive' }}
              </mat-slide-toggle>
            </td>
          </ng-container>
          <!-- Actions -->
          <ng-container matColumnDef="actions">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="bg-gray-100 dark:bg-gray-700 text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-100"
            >
              Actions
            </th>
            <td
              mat-cell
              *matCellDef="let user"
              class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
            >
              <button
                mat-icon-button
                color="primary"
                (click)="openUserDialog(user)"
                [disabled]="loading"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                (click)="confirmDelete(user)"
                [disabled]="loading"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator [pageSize]="10" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [``],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading = false;
  error = '';
  roles = [
    { value: 'admin', label: 'Admin', icon: 'security' },
    { value: 'doctor', label: 'Doctor', icon: 'medical_services' },
    { value: 'nurse', label: 'Nurse', icon: 'local_hospital' },
    { value: 'receptionist', label: 'Receptionist', icon: 'person' },
    { value: 'inventory', label: 'Inventory', icon: 'inventory_2' },
  ];

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        // Handle both direct array and wrapped response
        const users = res.data || res;
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 3000 });
      },
    });
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openUserDialog(user?: any) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: user ? { ...user } : null,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (user) {
          // Edit
          this.loading = true;
          this.usersService.updateUser(user._id, result).subscribe({
            next: (res: any) => {
              const updatedUser = res.data || res;
              Object.assign(user, updatedUser);
              this.snackBar.open('User updated successfully', 'Close', {
                duration: 2000,
              });
              this.loading = false;
            },
            error: (err) => {
              this.snackBar.open(
                err.error?.message || 'Failed to update user',
                'Close',
                { duration: 3000 }
              );
              this.loading = false;
            },
          });
        } else {
          // Add
          this.loading = true;
          this.usersService.createUser(result).subscribe({
            next: (res: any) => {
              const newUser = res.data || res;
              this.dataSource.data = [newUser, ...this.dataSource.data];
              this.snackBar.open('User created successfully', 'Close', {
                duration: 2000,
              });
              this.loading = false;
            },
            error: (err) => {
              this.snackBar.open(
                err.error?.message || 'Failed to create user',
                'Close',
                { duration: 3000 }
              );
              this.loading = false;
            },
          });
        }
      }
    });
  }

  confirmDelete(user: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete user ${user.full_name}?`,
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.usersService.deleteUser(user._id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: any) => u._id !== user._id
            );
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 2000,
            });
            this.loading = false;
          },
          error: (err) => {
            this.snackBar.open(
              err.error?.message || 'Failed to delete user',
              'Close',
              { duration: 3000 }
            );
            this.loading = false;
          },
        });
      }
    });
  }

  changeRole(user: any) {
    this.usersService.updateUserRole(user._id, user.role).subscribe({
      next: (res: any) => {
        const updatedUser = res.data || res;
        Object.assign(user, updatedUser);
        this.snackBar.open(`User role updated to ${user.role}`, 'Close', {
          duration: 2000,
        });
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Failed to update user role',
          'Close',
          { duration: 3000 }
        );
        // Revert the change on error
        this.loadUsers();
      },
    });
  }

  changeStatus(user: any) {
    const newStatus = user.status === 'active' ? 'active' : 'inactive';
    this.usersService.updateUserStatus(user._id, newStatus).subscribe({
      next: (res: any) => {
        const updatedUser = res.data || res;
        Object.assign(user, updatedUser);
        this.snackBar.open(`User status updated to ${newStatus}`, 'Close', {
          duration: 2000,
        });
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Failed to update user status',
          'Close',
          { duration: 3000 }
        );
        // Revert the change on error
        this.loadUsers();
      },
    });
  }
}
