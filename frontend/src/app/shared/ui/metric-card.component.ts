import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'relative overflow-hidden p-6 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 ' + bgClasses[color]">
      
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 24px 24px;"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div [class]="'p-3 rounded-xl ' + iconBgClasses[color]">
            <span [class]="'material-icons text-2xl ' + iconClasses[color]">{{ icon }}</span>
          </div>
          
          <!-- Trend Indicator (Optional) -->
          <div *ngIf="trend" [class]="'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ' + trendClasses[trend]">
            <span class="material-icons text-sm">{{ trend === 'up' ? 'trending_up' : 'trending_down' }}</span>
            <span>{{ trendValue }}</span>
          </div>
        </div>

        <!-- Metric Value -->
        <div class="mb-2">
          <h3 [class]="'text-4xl font-bold tracking-tight ' + textClasses[color]">
            {{ value }}
          </h3>
        </div>

        <!-- Label -->
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ label }}
        </p>

        <!-- Subtitle (Optional) -->
        <p *ngIf="subtitle" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {{ subtitle }}
        </p>
      </div>

      <!-- Decorative Element -->
      <div [class]="'absolute -bottom-2 -right-2 w-24 h-24 rounded-full opacity-10 blur-2xl ' + glowClasses[color]"></div>
    </div>
  `
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '0';
  @Input() icon: string = 'analytics';
  @Input() color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' = 'blue';
  @Input() subtitle?: string;
  @Input() trend?: 'up' | 'down';
  @Input() trendValue?: string;

  bgClasses = {
    blue: 'bg-white dark:bg-slate-900 border border-primary-100 dark:border-primary-900/30',
    green: 'bg-white dark:bg-slate-900 border border-success-100 dark:border-success-900/30',
    yellow: 'bg-white dark:bg-slate-900 border border-warning-100 dark:border-warning-900/30',
    red: 'bg-white dark:bg-slate-900 border border-error-100 dark:border-error-900/30',
    purple: 'bg-white dark:bg-slate-900 border border-accent-100 dark:border-accent-900/30',
    gray: 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800'
  };

  iconBgClasses = {
    blue: 'bg-primary-50 dark:bg-primary-900/20',
    green: 'bg-success-50 dark:bg-success-900/20',
    yellow: 'bg-warning-50 dark:bg-warning-900/20',
    red: 'bg-error-50 dark:bg-error-900/20',
    purple: 'bg-accent-50 dark:bg-accent-900/20',
    gray: 'bg-gray-50 dark:bg-gray-800/50'
  };

  iconClasses = {
    blue: 'text-primary-600 dark:text-primary-400',
    green: 'text-success-600 dark:text-success-400',
    yellow: 'text-warning-600 dark:text-warning-400',
    red: 'text-error-600 dark:text-error-400',
    purple: 'text-accent-600 dark:text-accent-400',
    gray: 'text-gray-600 dark:text-gray-400'
  };

  textClasses = {
    blue: 'text-gray-900 dark:text-white',
    green: 'text-gray-900 dark:text-white',
    yellow: 'text-gray-900 dark:text-white',
    red: 'text-gray-900 dark:text-white',
    purple: 'text-gray-900 dark:text-white',
    gray: 'text-gray-900 dark:text-white'
  };

  glowClasses = {
    blue: 'bg-primary-500',
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
    red: 'bg-error-500',
    purple: 'bg-accent-500',
    gray: 'bg-gray-500'
  };

  trendClasses = {
    up: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400',
    down: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400'
  };
}
