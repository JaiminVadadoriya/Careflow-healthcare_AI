
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-metric',
  templateUrl: './app-card-metric.component.html',
  styleUrls: ['./app-card-metric.component.scss'],
    standalone: false
})
export class AppCardMetricComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon?: string;
} 