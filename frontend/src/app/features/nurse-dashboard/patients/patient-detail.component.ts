import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NurseService } from '../nurse.service';

@Component({
  selector: 'app-nurse-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-2">Patient Details</h2>
      <mat-card class="mb-4">
        <div class="flex flex-col gap-2">
          <div><span class="font-semibold">Name:</span> {{ data.full_name }}</div>
          <div><span class="font-semibold">DOB:</span> {{ data.dob }}</div>
          <div><span class="font-semibold">ID:</span> {{ data._id }}</div>
        </div>
      </mat-card>

      <mat-card class="mb-4" *ngIf="vitalsHistory.length">
        <h3 class="font-semibold mb-2">Vitals History</h3>
        <ul class="list-disc pl-6">
          <li *ngFor="let vital of vitalsHistory">
            BP: {{ vital.blood_pressure }}, HR: {{ vital.heart_rate }},
            Temp: {{ vital.temperature }}, O2: {{ vital.oxygen_saturation }} 
            ({{ vital.date }})
          </li>
        </ul>
      </mat-card>

      <mat-card>
        <h3 class="font-semibold mb-2">Add Vitals</h3>
        <form (ngSubmit)="addVitals()" class="flex flex-col gap-2">
          <mat-form-field >
            <mat-label>Blood Pressure</mat-label>
            <input matInput [(ngModel)]="vitals.blood_pressure" name="blood_pressure" required>
          </mat-form-field>
          <mat-form-field >
            <mat-label>Heart Rate</mat-label>
            <input matInput [(ngModel)]="vitals.heart_rate" name="heart_rate" required>
          </mat-form-field>
          <mat-form-field >
            <mat-label>Temperature</mat-label>
            <input matInput [(ngModel)]="vitals.temperature" name="temperature" required>
          </mat-form-field>
          <mat-form-field >
            <mat-label>Oxygen Saturation</mat-label>
            <input matInput [(ngModel)]="vitals.oxygen_saturation" name="oxygen_saturation" required>
          </mat-form-field>
          <div class="flex gap-2 justify-end mt-2">
            <button mat-button type="button" (click)="resetForm()">Reset</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="loading">
              {{ loading ? 'Saving...' : 'Add Vitals' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `
})
export class PatientDetailComponent implements OnInit {
  vitals = { blood_pressure: '', heart_rate: '', temperature: '', oxygen_saturation: '' };
  vitalsHistory: any[] = [];
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nurseService: NurseService
  ) {}

  ngOnInit(): void {
    this.loadVitalsHistory();
  }

  loadVitalsHistory() {
    this.nurseService.getPatientDetails(this.data._id).subscribe({
      next: (res: any) => {
        const medicalHistory = res?.data?.medical_history || [];
        this.vitalsHistory = medicalHistory
          .filter((entry: any) => entry.diagnosis === 'Vital Signs Check')
          .map((entry: any) => {
            let parsed: any = {};
            try {
              parsed = JSON.parse(entry.treatment);
            } catch (_) {}
            return {
              ...parsed,
              date: new Date(entry.date_time).toISOString().slice(0, 10)
            };
          });
      },
      error: () => {
        // Handle errors (optional)
      }
    });
  }

  addVitals() {
    this.loading = true;
    this.nurseService.addPatientVitals(this.data._id, this.vitals).subscribe({
      next: () => {
        this.vitalsHistory.unshift({
          ...this.vitals,
          date: new Date().toISOString().slice(0, 10)
        });
        this.resetForm();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.vitals = { blood_pressure: '', heart_rate: '', temperature: '', oxygen_saturation: '' };
  }
}
