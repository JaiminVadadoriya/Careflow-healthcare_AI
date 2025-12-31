import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private appService: AppService) {}

  getAssignedPatients() {
    return this.appService.getData('/users/doctor/patients');
  }

  getPatientDetails(id: string) {
    return this.appService.getData(`/users/nurse/patient/${id}`); // Adjust endpoint if needed
  }

  getAppointments() {
    return this.appService.getData('/users/doctor/appointments');
  }

  updateMedicalRecord(recordId: string, data: any) {
    return this.appService.patchData(`/users/doctor/records/${recordId}`, data);
  }

  addNoteToPatient(patientId: string, note: any) {
    // This may need a dedicated endpoint
    return this.appService.postData(`/notes/${patientId}`, note);
  }
} 