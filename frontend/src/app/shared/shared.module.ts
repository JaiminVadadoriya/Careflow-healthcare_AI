import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardMetricComponent } from './app-card-metric/app-card-metric.component';
import { AppUserTableComponent } from './app-user-table/app-user-table.component';

@NgModule({
  declarations: [AppCardMetricComponent],
  imports: [
    CommonModule, 
    AppUserTableComponent // It is standalone now
  ],
  exports: [AppCardMetricComponent, AppUserTableComponent]
})
export class SharedModule {}