import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from './users.service';
import { UserEditDialogComponent } from '../shared/user-edit-dialog/user-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ModalService } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h2 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400">Manage system access and roles</p>
        </div>
        <button
          (click)="openUserDialog()"
          [disabled]="loading"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="material-icons text-xl">add</span>
          <span class="font-medium">Add User</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6">
        <div class="relative w-full md:w-96">
          <input
            type="text"
            (keyup)="applyFilter($event)"
            placeholder="Search users..."
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
          />
          <span class="material-icons absolute left-3 top-3.5 text-gray-400">search</span>
        </div>
      </div>

      <!-- Alert -->
      <div *ngIf="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
         <span class="material-icons text-sm">error</span>
         {{ error }}
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
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Name</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Contact</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Role</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <!-- Name -->
                <td class="p-4">
                   <div class="flex items-center gap-3">
                     <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs uppercase">
                        {{ user.full_name.charAt(0) }}
                     </div>
                     <span class="font-medium text-gray-900 dark:text-white">{{ user.full_name }}</span>
                   </div>
                </td>
                
                <!-- Email/Phone -->
                <td class="p-4">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-900 dark:text-gray-200">{{ user.email }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ user.phone || 'N/A' }}</span>
                  </div>
                </td>

                <!-- Role -->
                <td class="p-4">
                  <div class="relative w-32">
                     <select [(ngModel)]="user.role" (change)="changeRole(user)" 
                       class="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-1.5 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
                        <option *ngFor="let r of roles" [value]="r.value">{{ r.label }}</option>
                     </select>
                     <span class="material-icons absolute right-2 top-1.5 text-gray-400 text-sm pointer-events-none">expand_more</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="p-4">
                   <button (click)="toggleStatus(user)" 
                      [class]="'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ' + 
                        (user.status === 'active' 
                           ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                           : 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')">
                      <span class="flex items-center gap-1">
                        <span [class]="'w-1.5 h-1.5 rounded-full ' + (user.status === 'active' ? 'bg-green-500' : 'bg-gray-400')"></span>
                        {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                      </span>
                   </button>
                </td>

                <!-- Actions -->
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openUserDialog(user)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                       <span class="material-icons text-[20px]">edit</span>
                    </button>
                    <button (click)="confirmDelete(user)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                       <span class="material-icons text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Empty State -->
              <tr *ngIf="filteredUsers.length === 0">
                 <td colspan="5" class="p-8 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your search.
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = false;
  error = '';
  
  roles = [
    { value: 'admin', label: 'Admin'},
    { value: 'doctor', label: 'Doctor'},
    { value: 'nurse', label: 'Nurse'},
    { value: 'receptionist', label: 'Receptionist'},
    { value: 'inventory', label: 'Inventory'},
  ];

  constructor(
    private usersService: UsersService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
        // In real app, replace MatSnackBar with a toast service
        console.error(this.error);
      },
    });
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (!filterValue) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => 
         user.full_name?.toLowerCase().includes(filterValue) || 
         user.email?.toLowerCase().includes(filterValue) ||
         user.role?.toLowerCase().includes(filterValue)
      );
    }
  }

  openUserDialog(user?: any) {
    const modalRef = this.modalService.open(UserEditDialogComponent, {
      data: user ? { ...user } : null
    });
    
    modalRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (user) {
          // Edit
          this.loading = true;
          this.usersService.updateUser(user._id, result).subscribe({
            next: (res: any) => {
              const updatedUser = res.data || res;
              // Update local state
              const index = this.users.findIndex(u => u._id === user._id);
              if (index !== -1) {
                this.users[index] = { ...this.users[index], ...updatedUser };
                this.applyFilter({ target: { value: '' } } as any); // Re-filter if needed, or just update
                this.filteredUsers = [...this.users]; // simple refresh
              }
              this.loading = false;
            },
            error: (err) => {
               this.error = err.error?.message || 'Failed to update user';
               this.loading = false;
            }
          });
        } else {
          // Add
          this.loading = true;
          this.usersService.createUser(result).subscribe({
            next: (res: any) => {
              const newUser = res.data || res;
              this.users = [newUser, ...this.users];
              this.filteredUsers = [...this.users];
              this.loading = false;
            },
            error: (err) => {
              this.error = err.error?.message || 'Failed to create user';
              this.loading = false;
            }
          });
        }
      }
    });
  }

  confirmDelete(user: any) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure you want to delete user ${user.full_name}?`,
      }
    });

    modalRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading = true;
        this.usersService.deleteUser(user._id).subscribe({
          next: () => {
            this.users = this.users.filter((u: any) => u._id !== user._id);
            this.filteredUsers = [...this.users];
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Failed to delete user';
            this.loading = false;
          },
        });
      }
    });
  }

  changeRole(user: any) {
    // Optimistic update already happened via ngModel
    this.usersService.updateUserRole(user._id, user.role).subscribe({
      next: (res: any) => {
         // Success
      },
      error: (err) => {
        console.error('Failed to update role', err);
        // Revert?
        this.loadUsers();
      },
    });
  }

  toggleStatus(user: any) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    // Optimistic
    user.status = newStatus;
    
    this.usersService.updateUserStatus(user._id, newStatus).subscribe({
      next: (res: any) => {
        // Success
      },
      error: (err) => {
        console.error('Failed to update status', err);
        user.status = newStatus === 'active' ? 'inactive' : 'active'; // Revert
      },
    });
  }
}
