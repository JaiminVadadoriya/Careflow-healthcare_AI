import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReceptionistDashboardComponent } from './receptionist-dashboard.component';

const routes: Routes = [
  { path: '', component: ReceptionistDashboardComponent }
];

@NgModule({
  // declarations: [ReceptionistDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ReceptionistDashboardModule {} 