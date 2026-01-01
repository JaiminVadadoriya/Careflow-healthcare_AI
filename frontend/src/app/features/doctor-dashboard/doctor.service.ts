import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from 'src/app/core/base-data.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService extends BaseDataService<any> {
    constructor(http: HttpClient) {
        super(http, '/users/doctor'); // Base endpoint
    }

    getAssignedPatients(): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/doctor/patients`, { headers: this.getHeaders() });
    }

    override getById(id: string): Observable<any> {
         // Specific endpoint for patient details if different from standard CRUD
        return this.http.get(`${this.apiUrl}/users/nurse/patient/${id}`, { headers: this.getHeaders() });
    }

    getAppointments(): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/doctor/appointments`, { headers: this.getHeaders() });
    }

    updateMedicalRecord(recordId: string, data: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/users/doctor/records/${recordId}`, data, { headers: this.getHeaders() });
    }

    addNoteToPatient(patientId: string, note: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users/doctor/notes/${patientId}`, note, { headers: this.getHeaders() });
    }

    getPatientDetails(id: string): Observable<any> {
        return this.getById(id);
    }
}