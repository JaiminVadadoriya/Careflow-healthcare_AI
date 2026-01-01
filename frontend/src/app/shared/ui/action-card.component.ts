import { Component, Input } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [RouterModule],
  template: `
    <a [routerLink]="route" 
       class="group flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 
              border border-gray-200 dark:border-slate-800 shadow-soft
              transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 
              hover:border-gray-300 dark:hover:border-slate-700 cursor-pointer
              active:scale-[0.98]">
      
      <!-- Icon Container -->
      <div [class]="'relative p-4 rounded-xl transition-all duration-300 ' + colorClasses[color] + ' group-hover:scale-110 group-hover:shadow-lg'">
        <span [class]="'material-icons text-2xl ' + textClasses[color]">{{ icon }}</span>
        
        <!-- Glow Effect on Hover -->
        <div [class]="'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl ' + glowClasses[color]"></div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-lg text-gray-900 dark:text-gray-100 
                   group-hover:text-primary-600 dark:group-hover:text-primary-400 
                   transition-colors duration-200 truncate">
          {{ label }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {{ description }}
        </p>
      </div>
      
      <!-- Arrow Icon -->
      <div class="flex-shrink-0">
        <span class="material-icons text-gray-300 dark:text-gray-600 
                     group-hover:text-primary-500 dark:group-hover:text-primary-400
                     group-hover:translate-x-1 transition-all duration-200">
          arrow_forward_ios
        </span>
      </div>
    </a>
  `
})
export class ActionCardComponent {
  @Input() label: string = '';
  @Input() description: string = 'Manage details';
  @Input() icon: string = 'circle';
  @Input() route: string | any[] = '/';
  @Input() color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' = 'blue';

  colorClasses = {
    blue: 'bg-primary-50 dark:bg-primary-900/20',
    green: 'bg-success-50 dark:bg-success-900/20',
    yellow: 'bg-warning-50 dark:bg-warning-900/20',
    red: 'bg-error-50 dark:bg-error-900/20',
    purple: 'bg-accent-50 dark:bg-accent-900/20',
    gray: 'bg-gray-50 dark:bg-gray-800/50'
  };

  textClasses = {
    blue: 'text-primary-600 dark:text-primary-400',
    green: 'text-success-600 dark:text-success-400',
    yellow: 'text-warning-600 dark:text-warning-400',
    red: 'text-error-600 dark:text-error-400',
    purple: 'text-accent-600 dark:text-accent-400',
    gray: 'text-gray-600 dark:text-gray-400'
  };

  glowClasses = {
    blue: 'bg-primary-500',
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
    red: 'bg-error-500',
    purple: 'bg-accent-500',
    gray: 'bg-gray-500'
  };
}
