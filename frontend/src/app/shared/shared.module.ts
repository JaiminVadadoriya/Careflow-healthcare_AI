import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppCardMetricComponent } from './app-card-metric/app-card-metric.component';
import { AppUserTableComponent } from './app-user-table/app-user-table.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatCardModule, MatIconModule, AppCardMetricComponent, AppUserTableComponent],
  exports: [AppCardMetricComponent, AppUserTableComponent]
})
export class SharedModule {} 