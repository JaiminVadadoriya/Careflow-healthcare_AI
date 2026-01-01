import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AppCardMetricComponent } from './app-card-metric/app-card-metric.component';
import { AppUserTableComponent } from './app-user-table/app-user-table.component';

@NgModule({
  declarations: [AppCardMetricComponent],
  imports: [
    CommonModule, 
    MatIconModule,
    MatCardModule,
    AppUserTableComponent // It is standalone now
  ],
  exports: [AppCardMetricComponent, AppUserTableComponent]
})
export class SharedModule {}