import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from 'src/app/core/base-data.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReceptionistService extends BaseDataService<any> {
  constructor(http: HttpClient) {
    super(http, '/users/receptionist');
  }

  registerPatient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/receptionist/register`, data, { headers: this.getHeaders() });
  }

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/receptionist/appointments`, data, { headers: this.getHeaders() });
  }

  checkInPatient(patientId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/receptionist/checkin/${patientId}`, {}, { headers: this.getHeaders() });
  }

  getPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/patients`, { headers: this.getHeaders() });
  }

  getAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/receptionist/appointments`, { headers: this.getHeaders() });
  }

  dischargePatient(patientId: string): Observable<any> {
    // Note: Typo in original 'checkout' endpoint vs 'discharge' in other places. Assuming 'discharge' based on code from controller.
    // Original service code had 'checkout', but controller has 'discharge' -> `receptionistDischargePatient`
    // Router map: `/receptionist/discharge/:patientId` -> `ReceptionistController.dischargePatient`
    return this.http.patch(`${this.apiUrl}/users/receptionist/discharge/${patientId}`, {}, { headers: this.getHeaders() });
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/receptionist/appointments/${appointmentId}`, { status: 'cancelled' }, { headers: this.getHeaders() });
  }

  rescheduleAppointment(appointmentId: string, date_time: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/receptionist/appointments/${appointmentId}`, { date_time }, { headers: this.getHeaders() });
  }

  updatePatient(patientId: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/patient/${patientId}`, data, { headers: this.getHeaders() });
  }

  getDoctors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/doctors`, { headers: this.getHeaders() });
  }

  updateAppointment(appointmentId: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/receptionist/appointments/${appointmentId}`, data, { headers: this.getHeaders() });
  }

  dichargePatientFromAppointment(patientId: string): Observable<any> {
      return this.http.patch(`${this.apiUrl}/users/receptionist/discharge/${patientId}`, {}, { headers: this.getHeaders() }); 
  }
}