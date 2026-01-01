import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../shared/theme/theme.service';

@Component({
  selector: 'dark-mode-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggleTheme()" 
      class="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle dark mode">
      
      <!-- Sun Icon (shown when light) -->
      <svg *ngIf="current === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>

      <!-- Moon Icon (shown when dark) -->
      <svg *ngIf="current === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </button>
  `,
})
export class DarkModeComponent implements OnInit {
  current: 'light' | 'dark' | 'system' = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.current = this.themeService.getCurrentTheme();
  }

  toggleTheme(): void {
    const newTheme = this.current === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
    this.current = newTheme;
  }
}
