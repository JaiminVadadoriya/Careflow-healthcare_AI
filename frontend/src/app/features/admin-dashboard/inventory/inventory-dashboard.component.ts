import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '../../../shared/layout/dashboard-layout.component';
import { InventoryComponent } from './inventory.component';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, InventoryComponent],
  template: `
    <app-dashboard-layout title="Inventory System" [role]="userRole">
      <ng-container sidebar-items>
        <!-- Home / Dashboard Link (Conditional) -->
        <a *ngIf="isAdmin" routerLink="/dashboard" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span class="material-icons text-[20px]">dashboard</span> <span>Main Dashboard</span>
        </a>

        <!-- Inventory Link -->
        <a routerLink="/inventory" routerLinkActive="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <span class="material-icons text-[20px]">inventory_2</span> <span>Inventory</span>
        </a>
      </ng-container>

      <app-inventory></app-inventory>
    </app-dashboard-layout>
  `
})
export class InventoryDashboardComponent {
  userRole: string = 'Staff';
  isAdmin: boolean = false;

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    this.userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff';
    this.isAdmin = user?.role === 'admin';
  }
}
