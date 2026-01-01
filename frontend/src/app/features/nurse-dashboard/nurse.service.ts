import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from 'src/app/core/base-data.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NurseService extends BaseDataService<any> {
  constructor(http: HttpClient) {
    super(http, '/users/nurse');
  }

  getAssignedPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/patients`, { headers: this.getHeaders() });
  }

  getPatientDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/patient/${id}`, { headers: this.getHeaders() });
  }

  addPatientVitals(patientId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/nurse/vitals/${patientId}`, data, { headers: this.getHeaders() });
  }

  assignOrReleaseBed(data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/nurse/bed-assignment`, data, { headers: this.getHeaders() });
  }

  getAllBeds(): Observable<any> {
    return this.http.get(`${this.apiUrl}/beds`, { headers: this.getHeaders() });
  }

  getAvailableBeds(): Observable<any> {
    return this.http.get(`${this.apiUrl}/beds/available`, { headers: this.getHeaders() });
  }
}