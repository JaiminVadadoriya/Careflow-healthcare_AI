import { Component, HostListener, OnInit } from '@angular/core';
import { ThemeService } from './shared/theme/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'CareFlow';
  isAuthenticated = false; // This controls whether the user is authenticated or not

  opened = false; // This controls whether the sidenav is opened or closed

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initTheme();
  }

  toggleNav() {
    this.opened = !this.opened;
  }
  isScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 0;
  }
}
