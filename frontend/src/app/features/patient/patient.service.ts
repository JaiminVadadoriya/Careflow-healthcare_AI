import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private appService: AppService) {}

  getProfile() {
    return this.appService.getData('/patient/profile');
  }
  getAppointments() {
    return this.appService.getData('/patient/appointments');
  }
  bookAppointment(data: any) {
    return this.appService.postData('/patient/appointments', data);
  }
  getLabResults() {
    return this.appService.getData('/patient/lab-results');
  }
  getMedicalRecords() {
    return this.appService.getData('/patient/medical-records');
  }
}