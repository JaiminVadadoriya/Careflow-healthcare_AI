import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  isOpen: boolean = false; // Track the state of the side nav

  @Output() navToggle: EventEmitter<boolean> = new EventEmitter(); // Output event

  toggleNav() {
    this.isOpen = !this.isOpen; // Toggle the side nav state
    this.navToggle.emit(this.isOpen); // Emit the current state
  }
}
