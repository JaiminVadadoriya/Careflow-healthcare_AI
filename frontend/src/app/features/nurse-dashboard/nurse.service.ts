import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({ providedIn: 'root' })
export class NurseService {
  constructor(private appService: AppService) {}

  getAssignedPatients() {
    // You may need a dedicated endpoint for nurse-assigned patients
    return this.appService.getData('/users/nurse/patients');
  }

  getPatientDetails(id: string) {
    return this.appService.getData(`/users/nurse/patient/${id}`);
  }

  addPatientVitals(patientId: string, data: any) {
    return this.appService.postData(`/users/nurse/vitals/${patientId}`, data);
  }

  assignOrReleaseBed(data: any) {
    return this.appService.patchData('/users/nurse/bed-assignment', data);
  }

  getAllBeds() {
    return this.appService.getData('/beds');
  }

  getAvailableBeds() {
    return this.appService.getData('/beds/available');
  }
} 