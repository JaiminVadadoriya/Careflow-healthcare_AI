import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'CareFlow';
  isAuthenticated = false; // This controls whether the user is authenticated or not

  opened = false; // This controls whether the sidenav is opened or closed

  toggleNav() {
    this.opened = !this.opened;
  }
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 0;
  }

}
