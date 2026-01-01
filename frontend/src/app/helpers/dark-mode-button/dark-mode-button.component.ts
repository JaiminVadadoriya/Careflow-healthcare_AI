
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode } from '../../shared/theme/theme.service';

@Component({
  selector: 'dark-mode-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="group relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 
             text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 
             transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 
             shadow-sm hover:shadow-md"
      [attr.aria-label]="'Switch to ' + getNextThemeLabel()"
      [title]="'Current: ' + getCurrentThemeLabel() + ' | Click to switch to ' + getNextThemeLabel()">
    
      <!-- Icon Container with Animation -->
      <div class="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110">
        <!-- Light Mode Icon -->
        <svg 
          *ngIf="currentTheme === 'light'" 
          class="absolute inset-0 w-5 h-5 animate-fade-in" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      
        <!-- Dark Mode Icon -->
        <svg 
          *ngIf="currentTheme === 'dark'" 
          class="absolute inset-0 w-5 h-5 animate-fade-in" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>

        <!-- System Mode Icon -->
        <svg 
          *ngIf="currentTheme === 'system'" 
          class="absolute inset-0 w-5 h-5 animate-fade-in" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Label (Hidden on mobile) -->
      <span class="hidden sm:block text-sm font-medium">
        {{ getCurrentThemeLabel() }}
      </span>

      <!-- Indicator Dot -->
      <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft"></span>
    </button>
    `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: scale(0.8) rotate(-10deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class DarkModeComponent implements OnInit {
  currentTheme: ThemeMode = 'system';
  isDark = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
    this.themeService.isDark$.subscribe(isDark => {
      this.isDark = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getCurrentThemeLabel(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  }

  getNextThemeLabel(): string {
    switch (this.currentTheme) {
      case 'light':
        return 'Dark';
      case 'dark':
        return 'System';
      case 'system':
        return 'Light';
    }
  }
}
