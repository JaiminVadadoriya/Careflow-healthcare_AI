import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private appService: AppService, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.appService.postData('/users/login', credentials);
  }

  handleLoginSuccess(response: any): void {
    const { accesstoken, refreshToken, user } = response.data;
    localStorage.setItem('access_token', accesstoken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.role === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (user.role === 'doctor') {
      this.router.navigate(['/doctor']);
    } else if (user.role === 'nurse') {
      this.router.navigate(['/nurse']);
    } else if (user.role === 'receptionist') {
      this.router.navigate(['/receptionist']);
    } else if (user.role === 'patient') {
      this.router.navigate(['/patient']);
    }else if (user.role === 'inventory') {
      this.router.navigate(['/inventory']);
    } 
    else {
      this.router.navigate(['/home']);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  hasRole(roles: string[]): boolean {
    // TODO: Implement real role check using JWT or user state
    return true;
  }
}
