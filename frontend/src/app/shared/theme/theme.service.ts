import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'careflow-theme';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private themeSubject = new BehaviorSubject<ThemeMode>('system');
  
  theme$ = this.themeSubject.asObservable();
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.getCurrentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }

  initTheme() {
    const savedTheme = this.getCurrentThemeFromStorage();
    this.setTheme(savedTheme);
  }

  setTheme(theme: ThemeMode) {
    localStorage.setItem(this.themeKey, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): ThemeMode {
    return this.themeSubject.value;
  }
  
  private getCurrentThemeFromStorage(): ThemeMode {
    const theme = localStorage.getItem(this.themeKey);
    return (theme as ThemeMode) || 'system';
  }

  private applyTheme(theme: ThemeMode) {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && this.mediaQuery.matches);

    this.isDarkSubject.next(isDark);

    // Add transition class temporarily
    root.classList.add('theme-transitioning');

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 300);
  }

  toggleTheme() {
    const current = this.getCurrentTheme();
    const next: ThemeMode = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.setTheme(next);
  }

  getEffectiveTheme(): 'light' | 'dark' {
    return this.isDarkSubject.value ? 'dark' : 'light';
  }
}
