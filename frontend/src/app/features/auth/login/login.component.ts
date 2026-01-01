import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppService } from '../../../app.service';
import { AuthService } from '../../../core/auth/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from '../../../shared/theme/theme.service';
import { DarkModeComponent } from '../../../helpers/dark-mode-button/dark-mode-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgOptimizedImage,
    DarkModeComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AppService],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  dynamicColor: string = '';
  imageUrl: string =
  'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg';
  
  loginForm!: FormGroup;
  hide = true;
  submitted = false;
  loading = false;
  errorMsg: string = '';
  
  constructor(private fb: FormBuilder, private auth: AuthService, private themeService: ThemeService) {}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.themeService.initTheme();
  }
  
  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    
    if (this.loginForm.invalid) return;
    
    this.loading = true;
    this.auth.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.auth.handleLoginSuccess(response);
        } else {
          this.errorMsg = response.message || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
        err?.error?.message || 'Login failed. Please try again.';
      },
    });
  }
}
