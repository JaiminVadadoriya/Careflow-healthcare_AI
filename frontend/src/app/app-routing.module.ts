import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareflowLandingPageComponent } from './landing/landing-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ChatbotComponent } from './landing/chatbot/chatbot.component';
import { RoleGuard } from './core/auth/role.guard';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: CareflowLandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'chatbot', component: ChatbotComponent },

  // Admin Dashboard (with children)
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    canLoad: [RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () =>
      import('./features/admin-dashboard/admin-dashboard-routing.module').then(
        (m) => m.AdminDashboardRoutingModule
      ),
  },

  // Doctor Dashboard (can also be lazy loaded)
  {
    path: 'doctor',
    canActivate: [RoleGuard],
    canLoad: [RoleGuard],
    data: { roles: ['admin', 'doctor'] },
    loadChildren: () =>
      import(
        './features/doctor-dashboard/doctor-dashboard-routing.module'
      ).then((m) => m.DoctorDashboardRoutingModule),
  },

  // Nurse Dashboard (can also be lazy loaded)
  {
    path: 'nurse',
    canActivate: [RoleGuard],
    canLoad: [RoleGuard],
    data: { roles: ['admin', 'nurse'] },
    loadChildren: () =>
      import('./features/nurse-dashboard/nurse-dashboard-routing.module').then(
        (m) => m.NurseDashboardRoutingModule
      ),
  },

  // Receptionist Dashboard (can also be lazy loaded)
  {
    path: 'receptionist',
    canActivate: [RoleGuard],
    canLoad: [RoleGuard],
    data: { roles: ['admin', 'receptionist'] },
    loadChildren: () =>
      import(
        './features/receptionist-dashboard/receptionist-dashboard-routing.module'
      ).then((m) => m.ReceptionistDashboardRoutingModule),
  },

  // Inventory (can also be lazy loaded)
  {
    path: 'inventory',
    canActivate: [RoleGuard],
    canLoad: [RoleGuard],
    data: { roles: ['admin', 'inventory'] },
    loadComponent: () =>
      import('./features/admin-dashboard/inventory/inventory.component').then(m => m.InventoryComponent)
  },

  // Patient (can also be lazy loaded)
  {
    path: 'patient',
    canActivate: [RoleGuard],
    canLoad: [RoleGuard],
    data: { roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
    loadChildren: () =>
      import('./features/patient/patient-dashboard-routing.module').then(
        (m) => m.PatientDashboardRoutingModule
      ),
  },

  // // Auth (can also be lazy loaded)
  // {
  //   path: 'auth',
  //   loadChildren: () =>
  //     import('./features/auth/auth-routing.module').then(m => m.AuthRoutingModule)
  // },

  // Wildcard Route
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
