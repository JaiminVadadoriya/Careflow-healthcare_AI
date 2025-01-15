import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MyErrorStateMatcher } from '../helpers/error-state-matcher/error-state-matcher';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent{
  dynamicColor: string = '';
  imageUrl: string = 'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg';

  loginForm: FormGroup;
  hide: boolean = true;
  submitted: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) { }
    console.log(this.loginForm.value);
    // throw new Error('Method not implemented.');
  }
}
