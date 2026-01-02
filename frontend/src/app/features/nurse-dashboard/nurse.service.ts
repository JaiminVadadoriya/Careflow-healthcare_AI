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

  getAllPatients(search: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/patients/all?search=${search}`, { headers: this.getHeaders() });
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

  // New Capabilities
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/dashboard-stats`, { headers: this.getHeaders() });
  }

  getDoctorOrders(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/orders/${patientId}`, { headers: this.getHeaders() });
  }

  addNursingNote(patientId: string, note: string, type: string = 'general'): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/nurse/notes/${patientId}`, { note, type }, { headers: this.getHeaders() });
  }

  getNursingNotes(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/notes/${patientId}`, { headers: this.getHeaders() });
  }

  getPatientVitals(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/nurse/vitals/${patientId}`, { headers: this.getHeaders() });
  }

  createBed(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/beds`, data, { headers: this.getHeaders() });
  }
}