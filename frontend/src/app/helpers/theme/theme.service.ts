// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(this.getStoredThemePreference());
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  toggleTheme(): void {
    const newTheme = !this.isDarkThemeSubject.value;
    this.isDarkThemeSubject.next(newTheme);
    localStorage.setItem('darkTheme', JSON.stringify(newTheme));
    this.updateBodyClass(newTheme);
  }

  private getStoredThemePreference(): boolean {
    const storedPreference = localStorage.getItem('darkTheme');
    // If no stored preference, use system preference
    if (!storedPreference) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return JSON.parse(storedPreference);
  }

  private updateBodyClass(isDark: boolean): void {
    // Update the body class to toggle themes
    if (isDark) {
      document.body.classList.add('dark-theme');
      // document.body.classList.remove('light-theme');
    } else {
      // document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
