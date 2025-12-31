import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DarkModeComponent } from 'src/app/helpers/dark-mode-button/dark-mode-button.component';
import { MyErrorStateMatcher } from 'src/app/helpers/error-state-matcher/error-state-matcher';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    DarkModeComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',

  standalone: true,
})
export class SignUpComponent  {
  hidePassword = true;
  loading = false;

  matcher = new MyErrorStateMatcher();
  signUpForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', Validators.required],
    gender: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService) {}
  onSubmit() {
    throw new Error('Method not implemented.');
  }

}
