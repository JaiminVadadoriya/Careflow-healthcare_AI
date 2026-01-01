import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientDashboardComponent } from './patient-dashboard.component';

const routes: Routes = [
  { path: '', component: PatientDashboardComponent }
];

@NgModule({
  // declarations: [PatientDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PatientModule {} 