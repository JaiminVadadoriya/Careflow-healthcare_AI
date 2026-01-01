import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class BaseDataService<T> {
  protected apiUrl = environment.apiUrl;

  constructor(protected http: HttpClient, protected endpoint: string) {}

  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}${this.endpoint}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${this.endpoint}/${id}`, { headers: this.getHeaders() });
  }

  create(data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${this.endpoint}`, data, { headers: this.getHeaders() });
  }

  update(id: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${this.endpoint}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.endpoint}/${id}`, { headers: this.getHeaders() });
  }
}
