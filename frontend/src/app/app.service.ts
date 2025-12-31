import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.getAccessToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getData(partUrl: string) {
    const requestOptions = {
      headers: this.getAuthHeaders(),
    };
    return this.http
      .get(`${this.apiUrl + partUrl}`, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  postData(partUrl: string, data: any) {
    const requestOptions = {
      headers: this.getAuthHeaders(),
    };
    return this.http
      .post(`${this.apiUrl + partUrl}`, JSON.stringify(data), requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  putData(partUrl: string, data: any) {
    const requestOptions = {
      headers: this.getAuthHeaders(),
    };
    return this.http
      .put(`${this.apiUrl + partUrl}`, JSON.stringify(data), requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  deleteData(partUrl: string) {
    const requestOptions = {
      headers: this.getAuthHeaders(),
    };
    return this.http
      .delete(`${this.apiUrl + partUrl}`, requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }

  patchData(partUrl: string, data: any) {
    const requestOptions = {
      headers: this.getAuthHeaders(),
    };
    return this.http
      .patch(`${this.apiUrl + partUrl}`, JSON.stringify(data), requestOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error)));
  }
}
