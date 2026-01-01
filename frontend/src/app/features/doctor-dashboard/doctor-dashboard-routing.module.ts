import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
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
    component: DoctorDashboardComponent,
    children: [
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: 'patients', loadComponent: () => import('./patients/patients.component').then(m => m.PatientsComponent) },
      { path: "notes", loadComponent: () => import('./notes/notes.component').then(m => m.NotesComponent) },
      { path: "appointments", loadComponent: () => import('./appointments/appointments.component').then(m => m.AppointmentsComponent) },
      ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorDashboardRoutingModule {}
