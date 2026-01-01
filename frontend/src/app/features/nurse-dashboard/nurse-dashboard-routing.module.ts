import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NurseDashboardComponent } from './nurse-dashboard.component';
// import { AdminDashboardComponent } from './admin-dashboard.component';
// import { UsersComponent } from './users/users.component';
// import { RolesComponent } from './roles/roles.component';
// import { ReportsComponent } from './reports/reports.component';
// import { InventoryComponent } from './inventory/inventory.component';
// import { AppointmentsComponent } from './appointments/appointments.component';
// import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
  {
    path: '',
    component: NurseDashboardComponent,
    children: [
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      {path: "patients", loadComponent: () => import('./patients/patients.component').then(m => m.PatientsComponent)},
      {path: "beds", loadComponent: () => import('./beds/beds.component').then(m => m.BedsComponent)},
      {path: "vitals", loadComponent: () => import('./vitals/vitals.component').then(m => m.VitalsComponent)},
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseDashboardRoutingModule {}
