import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { CareflowLandingPageComponent } from './landing/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: CareflowLandingPageComponent },  // Changed / to /home as landing page
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '/home' }  // Catch-all for 404 redirects to /home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
