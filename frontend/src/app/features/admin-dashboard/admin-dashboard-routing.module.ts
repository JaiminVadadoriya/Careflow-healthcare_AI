import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AppointmentsComponent } from '../doctor-dashboard/appointments/appointments.component';
import { StaffComponent } from './staff/staff.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
      // { path: 'roles', component: RolesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'settings', component: SettingsComponent },
      // { path: 'appointments', component: AppointmentsComponent },
      // { path: 'staff', component: StaffComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
