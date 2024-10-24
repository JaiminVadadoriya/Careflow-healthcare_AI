import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CareFlow';
  isSideNavOpen: boolean = false; // Track the state of the side nav

  toggleNav() {
    this.isSideNavOpen = !this.isSideNavOpen; // Toggle the state
  }

  onNavToggle(isOpen: boolean) {
    this.isSideNavOpen = isOpen; // Update the state based on the event
  }

}
