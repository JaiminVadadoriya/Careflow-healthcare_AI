import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionistDashboardComponent } from './receptionist-dashboard.component';

// <a routerLink="/receptionist" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>dashboard</mat-icon> Dashboard</a>
//           <a routerLink="/receptionist/patients" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>people</mat-icon> Patients</a>
//           <a routerLink="/receptionist/appointments" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>event</mat-icon> Appointments</a>
//           <a routerLink="/receptionist/checkin" routerLinkActive="bg-blue-100 dark:bg-blue-900" class="block px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-200 font-medium"><mat-icon>login</mat-icon> Check-In/Out</a>
        

const routes: Routes = [
  {
    path: '',
    component: ReceptionistDashboardComponent,
    children: [
    //   { path: '', redirectTo: 'users', pathMatch: 'full' },
      {path: 'patients', loadComponent: () => import('./patients/patients.component').then(m => m.PatientsComponent)},
      {path: 'appointments', loadComponent: () => import('./appointments/appointments.component').then(m => m.AppointmentsComponent)},
      {path: 'checkin', loadComponent: () => import('./checkin/checkin.component').then(m => m.CheckinComponent)},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionistDashboardRoutingModule {}
