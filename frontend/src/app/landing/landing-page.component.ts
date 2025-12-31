
import { AfterViewInit, Component, HostListener, inject, Inject, OnInit, Renderer2, DOCUMENT } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../shared/theme/theme.service';
import { DarkModeComponent } from '../helpers/dark-mode-button/dark-mode-button.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from "./chatbot/chatbot.component";
// import { ThemeService } from '../helpers/theme/theme.service';


@Component({
    selector: 'app-careflow-landing-page',
    imports: [DarkModeComponent, MatFormFieldModule,
    MatCardModule,
    MatChipsModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule, MatListModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatGridListModule, ChatbotComponent, ChatbotComponent],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    standalone: true
})
export class CareflowLandingPageComponent implements OnInit, AfterViewInit {
  private _snackBar = inject(MatSnackBar);

  isDarkTheme = false;
  appointment = {
    name: '',
    date: '',
    time: ''
  };
  isScrolled = false;

  availableSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];

  snackbarMessage = '';
    

  features = [
    { icon: 'psychology', title: 'AI-Powered Forecasting', description: 'Predict healthcare demands using ML and data.' },
    { icon: 'event', title: 'Dynamic Scheduling', description: 'Intelligent appointment scheduling in real-time.' },
    { icon: 'group', title: 'Resource Management', description: 'Optimize staff and resources based on analytics.' },
    { icon: 'smart_toy', title: 'AI Chatbot Support', description: 'Automated patient support through chatbots.' },
  ];

  stats = [
    { value: '85%', label: 'Reduction in No-Shows' },
    { value: '40%', label: 'Improved Efficiency' },
    { value: '95%', label: 'Patient Satisfaction' },
    { value: '24/7', label: 'System Availability' },
  ];


  bookAppointment(): void {

    this.snackbarMessage = 'Appointment Booked Successfully!';
    this._snackBar.open(this.snackbarMessage, 'Close',)
    setTimeout(() => {
      this.snackbarMessage = '';
    }, 3000);
  }

  constructor(private themeService: ThemeService,@Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
  }
  ngOnInit(): void {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.isDarkTheme = true;
      this.renderer.addClass(this.document.body, 'dark-theme');
      this.renderer.removeClass(this.document.body, 'light-theme'); // Ensure only one theme class
    } else {
      this.isDarkTheme = false;
      // Ensure light-theme is applied if it's not the default un-classed state
      this.renderer.addClass(this.document.body, 'light-theme');
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    
    this.isScrolled = window.scrollY > 50;
    const sections = document.querySelectorAll('section');
    const scrollY = window.scrollY + window.innerHeight * 0.8;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (scrollY > top) {
        section.classList.add('visible');
      }
    });
  }

  ngAfterViewInit() {
    this.onWindowScroll(); // initial reveal
  }

  toggleTheme(event:any): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      this.renderer.removeClass(this.document.body, 'light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.addClass(this.document.body, 'light-theme');
      this.renderer.removeClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}