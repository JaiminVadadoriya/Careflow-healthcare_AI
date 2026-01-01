import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from 'src/app/core/base-data.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReceptionistService extends BaseDataService<any> {
  constructor(http: HttpClient) {
    super(http, '/receptionist');
  }

  // Override or add specific methods

  registerPatient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/receptionist/patients`, data, { headers: this.getHeaders() });
  }

  getPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/receptionist/patients`, { headers: this.getHeaders() });
  }

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/receptionist/appointments`, data, { headers: this.getHeaders() });
  }

  getAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/receptionist/appointments`, { headers: this.getHeaders() });
  }

  checkInPatient(patientId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/receptionist/patients/${patientId}/checkin`, {}, { headers: this.getHeaders() });
  }

  dischargePatient(patientId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/receptionist/patients/${patientId}/discharge`, {}, { headers: this.getHeaders() });
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/receptionist/appointments/${appointmentId}`, { status: 'cancelled' }, { headers: this.getHeaders() });
  }

  rescheduleAppointment(appointmentId: string, date_time: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/receptionist/appointments/${appointmentId}`, { date_time }, { headers: this.getHeaders() });
  }

  updateAppointment(appointmentId: string, data: any): Observable<any> {
     return this.http.patch(`${this.apiUrl}/receptionist/appointments/${appointmentId}`, data, { headers: this.getHeaders() });
  }

  // General routes (not under /receptionist but accessible)
  
  updatePatient(patientId: string, data: any): Observable<any> {
    // Assuming /api/v1/patients route exists for general updates
    return this.http.patch(`${this.apiUrl}/patients/${patientId}`, data, { headers: this.getHeaders() });
  }

  getDoctors(): Observable<any> {
    // Return doctors/users from receptionist endpoint to fix 404
    return this.http.get(`${this.apiUrl}/receptionist/doctors`, { headers: this.getHeaders() });
  }

  checkAvailability(doctorId: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/receptionist/doctors/${doctorId}/availability?date=${date}`, { headers: this.getHeaders() });
  }
}