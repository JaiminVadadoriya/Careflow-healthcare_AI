import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-action-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="route" 
       class="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-gray-200 dark:hover:border-gray-600 group cursor-pointer">
      <div [class]="'p-3 rounded-lg transition-colors duration-300 ' + colorClasses[color] + ' group-hover:scale-110 transform'">
        <span [class]="'material-icons ' + textClasses[color]">{{ icon }}</span>
      </div>
      <div>
        <h4 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ label }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ description }}</p>
      </div>
      <span class="material-icons ml-auto text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">arrow_forward_ios</span>
    </a>
  `
})
export class ActionCardComponent {
  @Input() label: string = '';
  @Input() description: string = 'Manage details'; // Default description
  @Input() icon: string = 'circle';
  @Input() route: string | any[] = '/';
  @Input() color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' = 'blue';

  colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    yellow: 'bg-amber-50 dark:bg-amber-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    gray: 'bg-gray-50 dark:bg-gray-800'
  };

  textClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-400'
  };
}
