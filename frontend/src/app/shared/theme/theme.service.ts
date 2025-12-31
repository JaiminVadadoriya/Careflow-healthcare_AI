// src/app/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeKey = 'theme';

  initTheme() {
    const userTheme = localStorage.getItem(this.themeKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    if (theme === 'system') {
      localStorage.removeItem(this.themeKey);
      this.initTheme();
      return;
    }

    localStorage.setItem(this.themeKey, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  getCurrentTheme(): 'light' | 'dark' | 'system' {
    return (localStorage.getItem(this.themeKey) as any) || 'system';
  }
}
