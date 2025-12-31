import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NurseService } from '../nurse.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vitals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>🩺 Enter Patient Vitals</h2>

<div *ngIf="successMessage" class="alert alert-success">
  {{ successMessage }}
</div>
<div *ngIf="errorMessage" class="alert alert-danger">
  {{ errorMessage }}
</div>

<form (ngSubmit)="submitVitals()">
  <label>
    Patient ID:
    <input type="text" [(ngModel)]="patientId" name="patientId" required />
  </label><br />

  <label>
    Blood Pressure:
    <input type="text" [(ngModel)]="vitals.blood_pressure" name="blood_pressure" required />
  </label><br />

  <label>
    Heart Rate (bpm):
    <input type="number" [(ngModel)]="vitals.heart_rate" name="heart_rate" required />
  </label><br />

  <label>
    Temperature (°C):
    <input type="number" step="0.1" [(ngModel)]="vitals.temperature" name="temperature" required />
  </label><br />

  <label>
    Oxygen Saturation (%):
    <input type="number" [(ngModel)]="vitals.oxygen_saturation" name="oxygen_saturation" required />
  </label><br />

  <button type="submit">Submit Vitals</button>
</form>

  `,
  styles: [`form {
  max-width: 500px;
  margin-top: 20px;
}
input {
  width: 100%;
  padding: 6px;
  margin: 5px 0 10px 0;
}
.alert {
  padding: 10px;
  margin: 10px 0;
}
.alert-success {
  background-color: #d4edda;
  border-left: 5px solid #28a745;
}
.alert-danger {
  background-color: #f8d7da;
  border-left: 5px solid #dc3545;
}
`]
})
export class VitalsComponent {
  patientId = '';
  vitals = {
    blood_pressure: '',
    heart_rate: '',
    temperature: '',
    oxygen_saturation: ''
  };
  successMessage = '';
  errorMessage = '';

  constructor(private nurseService: NurseService) {}

  submitVitals() {
    if (!this.patientId) {
      this.errorMessage = 'Patient ID is required';
      return;
    }

    this.nurseService.addPatientVitals(this.patientId, this.vitals).subscribe({
      next: (res: any) => {
        this.successMessage = 'Vitals submitted successfully.';
        this.errorMessage = '';
        this.vitals = {
          blood_pressure: '',
          heart_rate: '',
          temperature: '',
          oxygen_saturation: ''
        };
        this.patientId = '';
      },
      error: (err: HttpErrorResponse) => {
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Submission failed.';
      }
    });
  }
}
