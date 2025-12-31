import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NurseDashboardComponent } from './nurse-dashboard.component';

const routes: Routes = [
  { path: '', component: NurseDashboardComponent }
];

@NgModule({
  // declarations: [NurseDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class NurseDashboardModule {} 