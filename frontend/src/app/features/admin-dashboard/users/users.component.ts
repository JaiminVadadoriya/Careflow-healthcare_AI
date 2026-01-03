import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { UsersService } from './users.service';
import { UserEditDialogComponent } from '../shared/user-edit-dialog/user-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ModalService } from 'src/app/shared/ui/modal.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule
],
  template: `
    <div class="p-6 max-w-[1600px] mx-auto space-y-6">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row justify-between items-end gap-4 p-1">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">User Management</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Manage system access, roles, and account statuses.</p>
        </div>
        <button
          (click)="openUserDialog()"
          [disabled]="loading"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
          <span class="material-icons text-xl">add</span>
          <span>Add New User</span>
        </button>
      </div>
    
      <!-- Toolbar -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div class="relative w-full md:w-96 group">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="material-icons text-slate-400 group-focus-within:text-blue-500 transition-colors">search</span>
             </div>
             <input
               type="text"
               (keyup)="applyFilter($event)"
               placeholder="Search by name, email, or role..."
               class="block w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
             />
          </div>

          <div class="flex items-center gap-2 text-sm text-slate-500">
             <span>Showing {{ filteredUsers.length }} users</span>
             <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Filter" (click)="loadUsers()">
                <span class="material-icons text-slate-400">refresh</span>
             </button>
          </div>
      </div>
    
      <!-- Alert -->
      @if (error) {
         <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
           <span class="material-icons text-sm">error</span>
           {{ error }}
         </div>
      }
    
      <!-- Loading State -->
      @if (loading) {
         <div class="flex flex-col items-center justify-center py-24 space-y-4">
            <div class="relative w-16 h-16">
               <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900/30 rounded-full"></div>
               <div class="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p class="text-slate-500 font-medium">Loading users...</p>
         </div>
      }
    
      <!-- Modern Table -->
      @if (!loading) {
         <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
           <div class="overflow-x-auto">
             <table class="w-full text-left border-collapse">
               <thead>
                 <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                   <th class="p-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">User Profile</th>
                   <th class="p-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Role & Permissions</th>
                   <th class="p-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Account Status</th>
                   <th class="p-5 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                 @for (user of filteredUsers; track user) {
                   <tr class="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200">
                     <!-- Profile -->
                     <td class="p-5">
                       <div class="flex items-center gap-4">
                         <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                           {{ user.full_name.charAt(0) }}
                         </div>
                         <div>
                            <div class="font-semibold text-slate-800 dark:text-white">{{ user.full_name }}</div>
                            <div class="text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                         </div>
                       </div>
                     </td>
                     <!-- Role -->
                     <td class="p-5">
                       <div class="relative w-40">
                         <select [(ngModel)]="user.role" (change)="changeRole(user)"
                           class="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:border-blue-300 transition-colors">
                           @for (r of roles; track r) {
                             <option [value]="r.value">{{ r.label }}</option>
                           }
                         </select>
                         <span class="material-icons absolute right-2 top-2.5 text-slate-400 text-sm pointer-events-none">expand_more</span>
                       </div>
                     </td>
                     <!-- Status -->
                     <td class="p-5">
                       <button (click)="toggleStatus(user)"
                         [class]="'group/status relative px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-2 w-fit ' + 
                           (user.status === 'active' 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100' 
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100')">
                          <span [class]="'w-2 h-2 rounded-full ' + (user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400')"></span>
                          <span>{{ user.status === 'active' ? 'Active' : 'Inactive' }}</span>
                          <span class="absolute inset-0 rounded-full ring-2 ring-emerald-500/0 group-hover/status:ring-emerald-500/20 transition-all"></span>
                       </button>
                     </td>
                     <!-- Actions -->
                     <td class="p-5 text-right">
                       <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                         <button (click)="openUserDialog(user)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit User">
                           <span class="material-icons text-[20px]">edit</span>
                         </button>
                         <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                         <button (click)="confirmDelete(user)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Delete User">
                           <span class="material-icons text-[20px]">delete</span>
                         </button>
                       </div>
                     </td>
                   </tr>
                 }
                 <!-- Empty State -->
                 @if (filteredUsers.length === 0) {
                   <tr>
                     <td colspan="4" class="p-16 text-center">
                        <div class="flex flex-col items-center justify-center text-slate-400">
                           <span class="material-icons text-6xl mb-4 text-slate-200 dark:text-slate-700">search_off</span>
                           <h3 class="text-lg font-semibold text-slate-600 dark:text-slate-300">No users found</h3>
                           <p class="text-sm">Try adjusting your search terms.</p>
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
