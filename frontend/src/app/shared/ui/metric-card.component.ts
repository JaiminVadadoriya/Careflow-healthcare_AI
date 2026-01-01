import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <div class="p-6 flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ label }}</p>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{{ value }}</h3>
        </div>
        <div [class]="'p-3 rounded-xl ' + colorClasses[color] + ' transition-colors duration-300'">
            <span [class]="'material-icons ' + textClasses[color]">{{ icon }}</span>
        </div>
      </div>
      
      <!-- Decorative Background Gradient -->
      <div [class]="'absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl ' + bgClasses[color]"></div>
    </div>
  `,
  styles: []
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = 0;
  @Input() icon: string = 'analytics';
  @Input() color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' = 'blue';

  colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    yellow: 'bg-amber-50 dark:bg-amber-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20'
  };

  textClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400'
  };

  bgClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };
}
