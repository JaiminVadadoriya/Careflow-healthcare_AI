
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DarkModeComponent } from 'src/app/helpers/dark-mode-button/dark-mode-button.component';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    DarkModeComponent
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  standalone: true,
})
export class SignUpComponent  {
  hidePassword = true;
  loading = false;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.loading = true;
      this.auth.signup(this.signUpForm.value).subscribe({
        next: (res: any) => {
          this.loading = false;
           // Auth service handles redirect or we do it here?
           // Assuming handler
           this.auth.handleLoginSuccess(res);
        },
        error: (err: any) => {
          this.loading = false;
          // Ideally show error message variable
          alert(err.error?.message || 'Signup failed');
        }
      });
    }
  }

}
