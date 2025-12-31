import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTabsModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Reports & Analytics</h2>
        <div class="flex gap-2">
          <button mat-stroked-button color="accent" (click)="exportCSV()" [disabled]="loading">
            <mat-icon>download</mat-icon> Export CSV
          </button>
          <button mat-stroked-button color="accent" (click)="exportPDF()" [disabled]="loading">
            <mat-icon>picture_as_pdf</mat-icon> Export PDF
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <mat-spinner></mat-spinner>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Dashboard Overview -->
      <div *ngIf="!loading && dashboardData" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <mat-card class="bg-blue-50">
          <mat-card-content class="text-center">
            <mat-icon class="text-blue-600 text-4xl mb-2">group</mat-icon>
            <div class="text-2xl font-bold text-blue-600">{{ dashboardData.totalUsers }}</div>
            <div class="text-gray-600">Total Users</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="bg-green-50">
          <mat-card-content class="text-center">
            <mat-icon class="text-green-600 text-4xl mb-2">event</mat-icon>
            <div class="text-2xl font-bold text-green-600">{{ dashboardData.totalAppointments }}</div>
            <div class="text-gray-600">Appointments</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="bg-yellow-50">
          <mat-card-content class="text-center">
            <mat-icon class="text-yellow-600 text-4xl mb-2">inventory_2</mat-icon>
            <div class="text-2xl font-bold text-yellow-600">{{ dashboardData.totalInventoryItems }}</div>
            <div class="text-gray-600">Inventory Items</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="bg-red-50">
          <mat-card-content class="text-center">
            <mat-icon class="text-red-600 text-4xl mb-2">bed</mat-icon>
            <div class="text-2xl font-bold text-red-600">{{ dashboardData.occupiedBeds }}</div>
            <div class="text-gray-600">Beds Occupied</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Report Tabs -->
      <mat-card *ngIf="!loading">
        <mat-tab-group>
          <!-- User Reports Tab -->
          <mat-tab label="User Reports">
            <div class="p-4">
              <div class="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Role Filter</mat-label>
                  <mat-select [(ngModel)]="userFilters.role">
                    <mat-option value="">All Roles</mat-option>
                    <mat-option value="admin">Admin</mat-option>
                    <mat-option value="doctor">Doctor</mat-option>
                    <mat-option value="nurse">Nurse</mat-option>
                    <mat-option value="receptionist">Receptionist</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Date From</mat-label>
                  <input matInput [matDatepicker]="userPickerFrom" [(ngModel)]="userFilters.startDate">
                  <mat-datepicker-toggle matSuffix [for]="userPickerFrom"></mat-datepicker-toggle>
                  <mat-datepicker #userPickerFrom></mat-datepicker>
                </mat-form-field>
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Date To</mat-label>
                  <input matInput [matDatepicker]="userPickerTo" [(ngModel)]="userFilters.endDate">
                  <mat-datepicker-toggle matSuffix [for]="userPickerTo"></mat-datepicker-toggle>
                  <mat-datepicker #userPickerTo></mat-datepicker>
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="loadUserReports()">Filter</button>
              </div>
              
              <table mat-table [dataSource]="userDataSource" class="min-w-full">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let user">{{ user.full_name }}</td>
                </ng-container>
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">{{ user.email }}</td>
                </ng-container>
                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Role</th>
                  <td mat-cell *matCellDef="let user">{{ user.role | titlecase }}</td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let user">{{ user.status | titlecase }}</td>
                </ng-container>
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef>Created</th>
                  <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'yyyy-MM-dd' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
              </table>
            </div>
          </mat-tab>

          <!-- Appointment Reports Tab -->
          <mat-tab label="Appointment Reports">
            <div class="p-4">
              <div class="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Status Filter</mat-label>
                  <mat-select [(ngModel)]="appointmentFilters.status">
                    <mat-option value="">All Status</mat-option>
                    <mat-option value="scheduled">Scheduled</mat-option>
                    <mat-option value="completed">Completed</mat-option>
                    <mat-option value="cancelled">Cancelled</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Date From</mat-label>
                  <input matInput [matDatepicker]="appointmentPickerFrom" [(ngModel)]="appointmentFilters.startDate">
                  <mat-datepicker-toggle matSuffix [for]="appointmentPickerFrom"></mat-datepicker-toggle>
                  <mat-datepicker #appointmentPickerFrom></mat-datepicker>
                </mat-form-field>
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Date To</mat-label>
                  <input matInput [matDatepicker]="appointmentPickerTo" [(ngModel)]="appointmentFilters.endDate">
                  <mat-datepicker-toggle matSuffix [for]="appointmentPickerTo"></mat-datepicker-toggle>
                  <mat-datepicker #appointmentPickerTo></mat-datepicker>
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="loadAppointmentReports()">Filter</button>
              </div>
              
              <table mat-table [dataSource]="appointmentDataSource" class="min-w-full">
                <ng-container matColumnDef="patient">
                  <th mat-header-cell *matHeaderCellDef>Patient</th>
                  <td mat-cell *matCellDef="let appointment">{{ appointment.patient?.full_name }}</td>
                </ng-container>
                <ng-container matColumnDef="doctor">
                  <th mat-header-cell *matHeaderCellDef>Doctor</th>
                  <td mat-cell *matCellDef="let appointment">{{ appointment.doctor?.full_name }}</td>
                </ng-container>
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let appointment">{{ appointment.date_time | date:'yyyy-MM-dd HH:mm' }}</td>
                </ng-container>
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let appointment">{{ appointment.status | titlecase }}</td>
                </ng-container>
                <ng-container matColumnDef="reason">
                  <th mat-header-cell *matHeaderCellDef>Reason</th>
                  <td mat-cell *matCellDef="let appointment">{{ appointment.reason }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="appointmentColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: appointmentColumns;"></tr>
              </table>
            </div>
          </mat-tab>

          <!-- Inventory Reports Tab -->
          <mat-tab label="Inventory Reports">
            <div class="p-4">
              <div class="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Type Filter</mat-label>
                  <mat-select [(ngModel)]="inventoryFilters.type">
                    <mat-option value="">All Types</mat-option>
                    <mat-option value="medicine">Medicine</mat-option>
                    <mat-option value="equipment">Equipment</mat-option>
                    <mat-option value="supplies">Supplies</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field  class="w-full md:w-1/4">
                  <mat-label>Low Stock Only</mat-label>
                  <mat-select [(ngModel)]="inventoryFilters.lowStock">
                    <mat-option value="">All Items</mat-option>
                    <mat-option value="true">Low Stock Only</mat-option>
                  </mat-select>
                </mat-form-field>
                <button mat-raised-button color="primary" (click)="loadInventoryReports()">Filter</button>
              </div>
              
              <table mat-table [dataSource]="inventoryDataSource" class="min-w-full">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let item">{{ item.name }}</td>
                </ng-container>
                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Type</th>
                  <td mat-cell *matCellDef="let item">{{ item.type | titlecase }}</td>
                </ng-container>
                <ng-container matColumnDef="quantity">
                  <th mat-header-cell *matHeaderCellDef>Quantity</th>
                  <td mat-cell *matCellDef="let item">
                    <span [ngClass]="{'text-red-600 font-bold': item.quantity_available < item.minimum_required}">
                      {{ item.quantity_available }}
                    </span>
                  </td>
                </ng-container>
                <ng-container matColumnDef="minRequired">
                  <th mat-header-cell *matHeaderCellDef>Min Required</th>
                  <td mat-cell *matCellDef="let item">{{ item.minimum_required }}</td>
                </ng-container>
                <ng-container matColumnDef="supplier">
                  <th mat-header-cell *matHeaderCellDef>Supplier</th>
                  <td mat-cell *matCellDef="let item">{{ item.supplier_info?.name || '-' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="inventoryColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: inventoryColumns;"></tr>
              </table>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  loading = false;
  error = '';
  dashboardData: any = null;
  
  // User Reports
  userDataSource = new MatTableDataSource<any>([]);
  userColumns = ['name', 'email', 'role', 'status', 'createdAt'];
  userFilters: { role: string; startDate: Date | null; endDate: Date | null } = { role: '', startDate: null, endDate: null };
  
  // Appointment Reports
  appointmentDataSource = new MatTableDataSource<any>([]);
  appointmentColumns = ['patient', 'doctor', 'date', 'status', 'reason'];
  appointmentFilters: { status: string; startDate: Date | null; endDate: Date | null } = { status: '', startDate: null, endDate: null };
  
  // Inventory Reports
  inventoryDataSource = new MatTableDataSource<any>([]);
  inventoryColumns = ['name', 'type', 'quantity', 'minRequired', 'supplier'];
  inventoryFilters = { type: '', lowStock: '' };

  constructor(
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadUserReports();
    this.loadAppointmentReports();
    this.loadInventoryReports();
  }

  loadDashboardData() {
    this.loading = true;
    this.reportsService.getDashboardReports().subscribe({
      next: (res: any) => {
        this.dashboardData = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  loadUserReports() {
    const params: any = {};
    if (this.userFilters.role) params.role = this.userFilters.role;
    if (this.userFilters.startDate) params.startDate = this.userFilters.startDate.toISOString();
    if (this.userFilters.endDate) params.endDate = this.userFilters.endDate.toISOString();

    this.reportsService.getUserReports(params).subscribe({
      next: (res: any) => {
        this.userDataSource.data = res.data.users || [];
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to load user reports', 'Close', { duration: 3000 });
      }
    });
  }

  loadAppointmentReports() {
    const params: any = {};
    if (this.appointmentFilters.status) params.status = this.appointmentFilters.status;
    if (this.appointmentFilters.startDate) params.startDate = this.appointmentFilters.startDate.toISOString();
    if (this.appointmentFilters.endDate) params.endDate = this.appointmentFilters.endDate.toISOString();

    this.reportsService.getAppointmentReports(params).subscribe({
      next: (res: any) => {
        this.appointmentDataSource.data = res.data.appointments || [];
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to load appointment reports', 'Close', { duration: 3000 });
      }
    });
  }

  loadInventoryReports() {
    const params: any = {};
    if (this.inventoryFilters.type) params.type = this.inventoryFilters.type;
    if (this.inventoryFilters.lowStock) params.lowStock = this.inventoryFilters.lowStock;

    this.reportsService.getInventoryReports(params).subscribe({
      next: (res: any) => {
        this.inventoryDataSource.data = res.data.inventory || [];
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to load inventory reports', 'Close', { duration: 3000 });
      }
    });
  }

  exportCSV() {
    this.snackBar.open('CSV export functionality will be implemented soon!', 'Close', { duration: 2000 });
  }

  exportPDF() {
    this.snackBar.open('PDF export functionality will be implemented soon!', 'Close', { duration: 2000 });
  }
} 