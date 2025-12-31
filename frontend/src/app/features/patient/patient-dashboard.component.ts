import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from './patient.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">My Health Profile</h2>
      <mat-card class="mb-6">
        <div *ngIf="profile">
          <div><b>Name:</b> {{ profile.full_name }}</div>
          <div><b>Email:</b> {{ profile.email }}</div>
          <div><b>DOB:</b> {{ profile.dob }}</div>
          <div><b>Gender:</b> {{ profile.gender }}</div>
        </div>
      </mat-card>
      <h3 class="text-xl font-bold mb-2">Appointments</h3>
      <mat-card class="mb-6">
        <form
          (ngSubmit)="bookAppointment()"
          class="flex flex-col md:flex-row gap-4 mb-4"
        >
          <mat-form-field >
            <mat-label>Doctor ID</mat-label>
            <input
              matInput
              [(ngModel)]="apptForm.doctorId"
              name="doctorId"
              required
            />
          </mat-form-field>
          <mat-form-field >
            <mat-label>Date & Time</mat-label>
            <input
              matInput
              [(ngModel)]="apptForm.date_time"
              name="date_time"
              type="datetime-local"
              required
            />
          </mat-form-field>
          <mat-form-field >
            <mat-label>Reason</mat-label>
            <input
              matInput
              [(ngModel)]="apptForm.reason"
              name="reason"
              required
            />
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Book</button>
        </form>
        <table
          mat-table
          [dataSource]="appointments"
          class="min-w-full bg-white dark:bg-gray-800 rounded shadow"
        >
          <ng-container matColumnDef="doctor">
            <th mat-header-cell *matHeaderCellDef>Doctor</th>
            <td mat-cell *matCellDef="let appt">
              {{ appt.doctor?.full_name || appt.doctorId }}
            </td>
          </ng-container>
          <ng-container matColumnDef="date_time">
            <th mat-header-cell *matHeaderCellDef>Date & Time</th>
            <td mat-cell *matCellDef="let appt">{{ appt.date_time }}</td>
          </ng-container>
          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef>Reason</th>
            <td mat-cell *matCellDef="let appt">{{ appt.reason }}</td>
          </ng-container>
          <tr
            mat-header-row
            *matHeaderRowDef="['doctor', 'date_time', 'reason']"
          ></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: ['doctor', 'date_time', 'reason']"
          ></tr>
        </table>
      </mat-card>
      <h3 class="text-xl font-bold mb-2">Lab Results</h3>
      <mat-card class="mb-6">
        <table
          mat-table
          [dataSource]="labResults"
          class="min-w-full bg-white dark:bg-gray-800 rounded shadow"
        >
          <ng-container matColumnDef="test">
            <th mat-header-cell *matHeaderCellDef>Test</th>
            <td mat-cell *matCellDef="let result">{{ result.test_name }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let result">{{ result.test_date }}</td>
          </ng-container>
          <ng-container matColumnDef="result">
            <th mat-header-cell *matHeaderCellDef>Result</th>
            <td mat-cell *matCellDef="let result">{{ result.result }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['test', 'date', 'result']"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: ['test', 'date', 'result']"
          ></tr>
        </table>
      </mat-card>
      <h3 class="text-xl font-bold mb-2">Medical Records</h3>
      <mat-card>
        <table
          mat-table
          [dataSource]="medicalRecords"
          class="min-w-full bg-white dark:bg-gray-800 rounded shadow"
        >
          <ng-container matColumnDef="diagnosis">
            <th mat-header-cell *matHeaderCellDef>Diagnosis</th>
            <td mat-cell *matCellDef="let record">{{ record.diagnosis }}</td>
          </ng-container>
          <ng-container matColumnDef="treatment">
            <th mat-header-cell *matHeaderCellDef>Treatment</th>
            <td mat-cell *matCellDef="let record">{{ record.treatment }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let record">{{ record.date_time }}</td>
          </ng-container>
          <tr
            mat-header-row
            *matHeaderRowDef="['diagnosis', 'treatment', 'date']"
          ></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: ['diagnosis', 'treatment', 'date']"
          ></tr>
        </table>
      </mat-card>
    </div>
  `,
})
export class PatientDashboardComponent implements OnInit {
  profile: any;
  appointments = new MatTableDataSource<any>([]);
  labResults = new MatTableDataSource<any>([]);
  medicalRecords = new MatTableDataSource<any>([]);
  apptForm = { doctorId: '', date_time: '', reason: '' };

  constructor(
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.patientService
      .getProfile()
      .subscribe((res: any) => (this.profile = res.data || res));
    this.patientService
      .getAppointments()
      .subscribe((res: any) => (this.appointments.data = res.data || res));
    this.patientService
      .getLabResults()
      .subscribe((res: any) => (this.labResults.data = res.data || res));
    this.patientService
      .getMedicalRecords()
      .subscribe((res: any) => (this.medicalRecords.data = res.data || res));
  }

  bookAppointment() {
    this.patientService.bookAppointment(this.apptForm).subscribe({
      next: (res: any) => {
        this.appointments.data = [res.data, ...this.appointments.data];
        this.snackBar.open('Appointment booked!', 'Close', { duration: 2000 });
        this.apptForm = { doctorId: '', date_time: '', reason: '' };
      },
      error: () => {
        this.snackBar.open('Failed to book appointment', 'Close', {
          duration: 2000,
        });
      },
    });
  }
}
