import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from 'src/app/shared/theme/theme.service';

@Component({
  selector: 'dark-mode-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  providers: [DarkModeComponent],
  template: `
    <button matIconButton (click)="toggleTheme()" aria-label="Toggle dark mode">
      <!--  -->
      <mat-icon>{{
        current === 'light' ? 'dark_mode' : 'light_mode'
      }}</mat-icon>
    </button>
  `,
})
export class DarkModeComponent implements OnInit {
  current: string = 'light';

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
