import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Insights and performance metrics</p>
        </div>
        <div class="flex gap-3">
          <button (click)="exportCSV()" [disabled]="loading" class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors bg-white dark:bg-gray-800">
            <span class="material-icons text-sm">download</span> Export CSV
          </button>
          <button (click)="exportPDF()" [disabled]="loading" class="flex items-center gap-2 px-4 py-2 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 transition-colors bg-blue-50/50 dark:bg-blue-900/10">
            <span class="material-icons text-sm">picture_as_pdf</span> Export PDF
          </button>
        </div>
      </div>
    
      <!-- Error -->
      @if (error) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
          {{ error }}
        </div>
      }
    
      <!-- Dashboard Overview Cards -->
      @if (!loading && dashboardData) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span class="material-icons text-2xl">group</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ dashboardData.totalUsers }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Users</div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <span class="material-icons text-2xl">event</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ dashboardData.totalAppointments }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Appointments</div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <span class="material-icons text-2xl">inventory_2</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ dashboardData.totalInventoryItems }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Inventory Items</div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 mb-3 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <span class="material-icons text-2xl">king_bed</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ dashboardData.occupiedBeds }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Beds Occupied</div>
          </div>
        </div>
      }
    
      <!-- Reports Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[500px]">
        <!-- Tab Headers -->
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          @for (tab of tabs; track tab) {
            <button
              (click)="activeTab = tab.id"
             [class]="'flex-1 py-4 text-sm font-medium transition-all relative ' + 
               (activeTab === tab.id 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50')"
              >
              {{ tab.label }}
              @if (activeTab === tab.id) {
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              }
            </button>
          }
        </div>
    
        <!-- Tab Content -->
        <div class="p-6">
    
          <!-- User Reports -->
          @if (activeTab === 'users') {
            <div>
              <div class="flex flex-col md:flex-row gap-4 mb-6">
                <select [(ngModel)]="userFilters.role" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <input type="date" [(ngModel)]="userFilters.startDate" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <input type="date" [(ngModel)]="userFilters.endDate" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <button (click)="loadUserReports()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  Filter
                </button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                    <tr>
                      <th class="p-4">Name</th>
                      <th class="p-4">Email</th>
                      <th class="p-4">Role</th>
                      <th class="p-4">Status</th>
                      <th class="p-4">Created</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    @for (user of userReports; track user) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-200">
                        <td class="p-4 font-medium">{{ user.full_name }}</td>
                        <td class="p-4 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
                        <td class="p-4"><span class="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{{ user.role }}</span></td>
                        <td class="p-4"><span class="capitalize">{{ user.status }}</span></td>
                        <td class="p-4 text-gray-500 dark:text-gray-500 text-sm">{{ user.createdAt | date }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
    
          <!-- Appointment Reports -->
          @if (activeTab === 'appointments') {
            <div>
              <div class="flex flex-col md:flex-row gap-4 mb-6">
                <select [(ngModel)]="appointmentFilters.status" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input type="date" [(ngModel)]="appointmentFilters.startDate" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <input type="date" [(ngModel)]="appointmentFilters.endDate" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <button (click)="loadAppointmentReports()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  Filter
                </button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                    <tr>
                      <th class="p-4">Patient</th>
                      <th class="p-4">Doctor</th>
                      <th class="p-4">Date</th>
                      <th class="p-4">Status</th>
                      <th class="p-4">Reason</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    @for (appt of appointmentReports; track appt) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-200">
                        <td class="p-4 font-medium">{{ appt.patient?.full_name }}</td>
                        <td class="p-4">{{ appt.doctor?.full_name }}</td>
                        <td class="p-4 text-sm">{{ appt.date_time | date:'short' }}</td>
                        <td class="p-4"><span [class]="'capitalize px-2 py-1 rounded text-xs font-medium ' + (appt.status === 'completed' ? 'bg-green-100 text-green-700' : appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')">{{ appt.status }}</span></td>
                        <td class="p-4 text-gray-500 dark:text-gray-500 text-sm truncate max-w-[200px]">{{ appt.reason }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
    
          <!-- Inventory Reports -->
          @if (activeTab === 'inventory') {
            <div>
              <div class="flex flex-col md:flex-row gap-4 mb-6">
                <select [(ngModel)]="inventoryFilters.type" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Types</option>
                  <option value="medicine">Medicine</option>
                  <option value="equipment">Equipment</option>
                  <option value="supplies">Supplies</option>
                </select>
                <select [(ngModel)]="inventoryFilters.lowStock" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Items</option>
                  <option value="true">Low Stock Only</option>
                </select>
                <button (click)="loadInventoryReports()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                  Filter
                </button>
              </div>
              <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table class="w-full text-left border-collapse">
                  <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
                    <tr>
                      <th class="p-4">Name</th>
                      <th class="p-4">Type</th>
                      <th class="p-4">Quantity</th>
                      <th class="p-4">Min Required</th>
                      <th class="p-4">Supplier</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    @for (item of inventoryReports; track item) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-200">
                        <td class="p-4 font-medium">{{ item.name }}</td>
                        <td class="p-4"><span class="capitalize px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{{ item.type }}</span></td>
                        <td class="p-4">
                          <span [class]="'font-bold ' + (item.quantity_available < item.minimum_required ? 'text-red-600' : 'text-gray-900 dark:text-white')">
                            {{ item.quantity_available }}
                          </span>
                        </td>
                        <td class="p-4 text-gray-600 dark:text-gray-400">{{ item.minimum_required }}</td>
                        <td class="p-4 text-gray-500 dark:text-gray-500 text-sm">{{ item.supplier_info?.name || '-' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
    
        </div>
      </div>
    </div>
    `
})
export class ReportsComponent implements OnInit {
  loading = false;
  error = '';
  dashboardData: any = null;
  activeTab = 'users'; // users | appointments | inventory
  
  tabs = [
    { id: 'users', label: 'User Reports' },
    { id: 'appointments', label: 'Appointment Reports' },
    { id: 'inventory', label: 'Inventory Reports' }
  ];

  // User Reports Data
  userReports: any[] = [];
  userFilters: { role: string; startDate: string; endDate: string } = { role: '', startDate: '', endDate: '' };
  
  // Appointment Reports Data
  appointmentReports: any[] = [];
  appointmentFilters: { status: string; startDate: string; endDate: string } = { status: '', startDate: '', endDate: '' };
  
  // Inventory Reports Data
  inventoryReports: any[] = [];
  inventoryFilters = { type: '', lowStock: '' };

  constructor(private reportsService: ReportsService) {}

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
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  loadUserReports() {
    const params: any = {};
    if (this.userFilters.role) params.role = this.userFilters.role;
    if (this.userFilters.startDate) params.startDate = new Date(this.userFilters.startDate).toISOString();
    if (this.userFilters.endDate) params.endDate = new Date(this.userFilters.endDate).toISOString();

    this.reportsService.getUserReports(params).subscribe({
      next: (res: any) => {
        this.userReports = res.data.users || [];
      },
      error: (err: any) => {
        console.error('Failed to load user reports', err);
      }
    });
  }

  loadAppointmentReports() {
    const params: any = {};
    if (this.appointmentFilters.status) params.status = this.appointmentFilters.status;
    if (this.appointmentFilters.startDate) params.startDate = new Date(this.appointmentFilters.startDate).toISOString();
    if (this.appointmentFilters.endDate) params.endDate = new Date(this.appointmentFilters.endDate).toISOString();

    this.reportsService.getAppointmentReports(params).subscribe({
      next: (res: any) => {
        this.appointmentReports = res.data.appointments || [];
      },
      error: (err: any) => {
        console.error('Failed to load appointment reports', err);
      }
    });
  }

  loadInventoryReports() {
    const params: any = {};
    if (this.inventoryFilters.type) params.type = this.inventoryFilters.type;
    if (this.inventoryFilters.lowStock) params.lowStock = this.inventoryFilters.lowStock;

    this.reportsService.getInventoryReports(params).subscribe({
      next: (res: any) => {
        this.inventoryReports = res.data.inventory || [];
      },
      error: (err: any) => {
        console.error('Failed to load inventory reports', err);
      }
    });
  }

  exportCSV() {
    alert('CSV export functionality will be implemented soon!');
  }

  exportPDF() {
    alert('PDF export functionality will be implemented soon!');
  }
}