import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({ providedIn: 'root' })
export class ReceptionistService {
  constructor(private appService: AppService) {}

  registerPatient(data: any) {
    return this.appService.postData('/users/receptionist/register', data);
  }

  bookAppointment(data: any) {
    return this.appService.postData('/users/receptionist/appointments', data);
  }

  checkInPatient(patientId: string) {
    return this.appService.patchData(`/users/receptionist/checkin/${patientId}`, {});
  }

  getPatients() {
    return this.appService.getData('/users/patients');
  }

  getAppointments() {
    // You may need to filter by receptionist or show all
    return this.appService.getData('/users/receptionist/appointments');
  }

  dischargePatient(patientId: string) {
    return this.appService.patchData(`/users/receptionist/checkout/${patientId}`, {});
  }
  cancelAppointment(appointmentId: string) {
    return this.appService.patchData(`/users/receptionist/appointments/${appointmentId}`, { status: 'cancelled' });
  }
  rescheduleAppointment(appointmentId: string, date_time: string) {
    return this.appService.patchData(`/users/receptionist/appointments/${appointmentId}`, { date_time });
  }
  updatePatient(patientId: string, data: any) {
    return this.appService.patchData(`/patient/${patientId}`, data);
  }
  getDoctors() {
    return this.appService.getData('/users/doctors');
  }

  updateAppointment(appointmentId: string, data: any) {
    return this.appService.patchData(`/users/receptionist/appointments/${appointmentId}`, data);
  }

  dichargePatientFromAppointment(patientId: string) {
    return this.appService.patchData(`/users/receptionist/discharge/${patientId}`, {}); 
  }  
} 