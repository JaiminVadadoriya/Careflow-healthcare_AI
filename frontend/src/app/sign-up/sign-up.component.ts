import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MyErrorStateMatcher } from '../helpers/error-state-matcher/error-state-matcher';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatRadioModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  matcher = new MyErrorStateMatcher();
  signInForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
    tel: new FormControl('', Validators.required),
    emergency: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required)
  });

  onSubmit() {
    throw new Error('Method not implemented.');
    }
}
