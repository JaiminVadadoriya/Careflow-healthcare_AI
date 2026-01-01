// src/app/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'theme';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', () => {
      if (this.getCurrentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }

  initTheme() {
    const savedTheme = this.getCurrentTheme();
    this.applyTheme(savedTheme);
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    localStorage.setItem(this.themeKey, theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): 'light' | 'dark' | 'system' {
    const theme = localStorage.getItem(this.themeKey);
    return (theme as 'light' | 'dark' | 'system') || 'system';
  }

  private applyTheme(theme: 'light' | 'dark' | 'system') {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && this.mediaQuery.matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
