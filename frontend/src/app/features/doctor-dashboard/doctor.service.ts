import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseDataService } from 'src/app/core/base-data.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService extends BaseDataService<any> {
    constructor(http: HttpClient) {
        super(http, '/doctor'); // Updated base endpoint
    }

    getAssignedPatients(): Observable<any> {
        return this.http.get(`${this.apiUrl}/doctor/patients`, { headers: this.getHeaders() });
    }

    override getById(id: string): Observable<any> {
         // Use the generic patient endpoint which doctors have access to
        return this.http.get(`${this.apiUrl}/patients/${id}`, { headers: this.getHeaders() });
    }

    getAppointments(): Observable<any> {
        return this.http.get(`${this.apiUrl}/doctor/appointments`, { headers: this.getHeaders() });
    }

    updateMedicalRecord(recordId: string, data: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/doctor/records/${recordId}`, data, { headers: this.getHeaders() });
    }

    addNoteToPatient(patientId: string, note: any): Observable<any> {
        // Assuming we map this to prescription or lab order? Or general notes?
        // Reuse createPrescription for now if it's a general note, or add specific endpoint.
        // For now, let's keep it but mapped to prescription with empty medications
        return this.createPrescription({ patientId, medications: [], notes: note.text });
    }

    getPatientDetails(id: string): Observable<any> {
        return this.getById(id);
    }

    // New Capabilities
    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/doctor/dashboard-stats`, { headers: this.getHeaders() });
    }

    createPrescription(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/doctor/prescriptions`, data, { headers: this.getHeaders() });
    }

    getPatientPrescriptions(patientId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/doctor/prescriptions/${patientId}`, { headers: this.getHeaders() });
    }

    orderLabTest(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/doctor/lab-orders`, data, { headers: this.getHeaders() });
    }

    getPatientLabOrders(patientId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/doctor/lab-orders/${patientId}`, { headers: this.getHeaders() });
    }

    updateAppointmentStatus(id: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/doctor/appointments/${id}/status`, { status }, { headers: this.getHeaders() });
    }

    rescheduleAppointment(id: string, newDate: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/doctor/appointments/${id}/reschedule`, { date_time: newDate }, { headers: this.getHeaders() });
    }
}