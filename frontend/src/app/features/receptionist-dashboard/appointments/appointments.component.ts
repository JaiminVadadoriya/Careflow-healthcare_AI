import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReceptionistService } from '../receptionist.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-receptionist-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Book Appointment</h2>

      <form
        (ngSubmit)="bookAppointment()"
        class="grid md:grid-cols-2 gap-4 mb-8"
      >
        <mat-form-field >
          <mat-label>Patient</mat-label>
          <mat-select [(ngModel)]="form.patientId" name="patientId" required>
            <mat-option *ngFor="let patient of patients" [value]="patient._id">
              {{ patient.name }} ({{ patient.email }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field >
          <mat-label>Doctor</mat-label>
          <mat-select [(ngModel)]="form.doctorId" name="doctorId" required>
            <mat-option *ngFor="let doctor of doctors" [value]="doctor._id">
              Dr. {{ doctor.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field >
          <mat-label>Date & Time</mat-label>
          <input
            matInput
            [(ngModel)]="form.date_time"
            name="date_time"
            type="datetime-local"
            required
          />
        </mat-form-field>

        <mat-form-field >
          <mat-label>Reason</mat-label>
          <input matInput [(ngModel)]="form.reason" name="reason" required />
        </mat-form-field>

        <div class="md:col-span-2 text-right">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="loading"
          >
            {{ loading ? 'Booking...' : 'Book' }}
          </button>
        </div>
      </form>

      <h2 class="text-xl font-bold mb-4">Appointments</h2>

      <mat-form-field  class="w-full md:w-1/3 mb-4">
        <mat-label>Search Appointments</mat-label>
        <input
          matInput
          [(ngModel)]="search"
          (ngModelChange)="applyFilter()"
          placeholder="Search by patient or doctor ID"
        />
      </mat-form-field>

      <div *ngIf="loading" class="flex justify-center py-8">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div
        *ngIf="!loading && dataSource.data.length === 0"
        class="text-center text-gray-500 py-10"
      >
        No appointments found.
      </div>

      <div *ngIf="!loading && dataSource.data.length" class="overflow-x-auto">
  <table
    mat-table
    [dataSource]="dataSource"
    class="min-w-full bg-white dark:bg-gray-800 mat-elevation-z2 rounded shadow-sm"
  >
    <!-- Patient Name Column -->
    <ng-container matColumnDef="patient">
      <th mat-header-cell *matHeaderCellDef>Patient</th>
      <td mat-cell *matCellDef="let appt">
        <div class="font-medium">
          {{ getPatientName(appt.patientId) }}
        </div>
        <small class="text-gray-500">
          {{ getPatientEmail(appt.patientId) }}
        </small>
      </td>
    </ng-container>

    <!-- Doctor Name Column -->
    <ng-container matColumnDef="doctor">
      <th mat-header-cell *matHeaderCellDef>Doctor</th>
      <td mat-cell *matCellDef="let appt">
        <div class="font-medium text-blue-700">
          Dr. {{ getDoctorName(appt.doctorId) }}
        </div>
        <small class="text-gray-500">
          {{ getDoctorEmail(appt.doctorId) }}
        </small>
      </td>
    </ng-container>

    <!-- Date & Time Column -->
    <ng-container matColumnDef="date_time">
      <th mat-header-cell *matHeaderCellDef>Date & Time</th>
      <td mat-cell *matCellDef="let appt">
        <span class="inline-block px-2 py-1 rounded bg-blue-50 text-sm text-blue-800">
          {{ appt.date_time | date : 'medium' }}
        </span>
      </td>
    </ng-container>

    <!-- Reason Column -->
    <ng-container matColumnDef="reason">
      <th mat-header-cell *matHeaderCellDef>Reason</th>
      <td mat-cell *matCellDef="let appt">
        <span class="italic text-gray-700">{{ appt.reason }}</span>
      </td>
    </ng-container>

    <!-- Actions Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <td mat-cell *matCellDef="let appt" class="space-x-2">
        <button
          mat-icon-button
          color="primary"
          matTooltip="Reschedule"
          (click)="reschedule(appt)"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <button
          mat-icon-button
          color="warn"
          matTooltip="Cancel Appointment"
          (click)="confirmCancel(appt)"
        >
          <mat-icon>cancel</mat-icon>
        </button>
      </td>
    </ng-container>

    <!-- Table Header & Row Declarations -->
    <tr mat-header-row *matHeaderRowDef="enhancedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: enhancedColumns"></tr>
  </table>
</div>


    </div>
  `,
})
export class AppointmentsComponent implements OnInit {
  patients: any[] = [];
  doctors: any[] = [];

  enhancedColumns = ['patient', 'doctor', 'date_time', 'reason', 'actions'];

  dataSource = new MatTableDataSource<any>([]);
  search = '';
  form = { patientId: '', doctorId: '', date_time: '', reason: '' };
  loading = false;

  constructor(
    private receptionistService: ReceptionistService,
    private snackBar: MatSnackBar
  ) {}

  getPatientName(patientId: string): string {
    const patient = this.patients.find(p => p && p._id === patientId);
    return patient?.full_name || patient?.name || patientId;
  }

  getPatientEmail(patientId: string): string {
    const patient = this.patients.find(p => p && p._id === patientId);
    return patient?.contact_info?.email || patient?.email || '';
  }

  getDoctorName(doctorId: string): string {
    const doctor = this.doctors.find(d => d && d._id === doctorId);
    return doctor?.full_name || doctor?.name || doctorId;
  }

  getDoctorEmail(doctorId: string): string {
    const doctor = this.doctors.find(d => d && d._id === doctorId);
    return doctor?.email || '';
  }
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  loadAppointments() {
    this.loading = true;
    this.receptionistService.getAppointments().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || res;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load appointments', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  loadPatients() {
    this.receptionistService.getPatients().subscribe({
      next: (res: any) => (this.patients = res.data || res),
      error: () =>
        this.snackBar.open('Failed to load patients', 'Close', {
          duration: 3000,
        }),
    });
  }

  loadDoctors() {
    this.receptionistService.getDoctors().subscribe({
      next: (res: any) => (this.doctors = res.data || res),
      error: () =>
        this.snackBar.open('Failed to load doctors', 'Close', {
          duration: 3000,
        }),
    });
  }

  bookAppointment() {
    this.loading = true;
    this.receptionistService.bookAppointment(this.form).subscribe({
      next: (res: any) => {
        this.snackBar.open('Appointment booked!', 'Close', { duration: 3000 });
        this.dataSource.data = [res.data, ...this.dataSource.data];
        this.form = { patientId: '', doctorId: '', date_time: '', reason: '' };
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Booking failed!', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
  }

  confirmCancel(appt: any) {
    if (confirm(`Cancel appointment for Patient ${appt.patientId}?`)) {
      this.receptionistService.cancelAppointment(appt._id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (a) => a._id !== appt._id
          );
          this.snackBar.open('Appointment cancelled', 'Close', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open('Failed to cancel appointment', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  reschedule(appt: any) {
    const newDate = prompt(
      'Enter new date/time (YYYY-MM-DDTHH:mm):',
      appt.date_time
    );
    if (newDate) {
      this.receptionistService
        .rescheduleAppointment(appt._id, newDate)
        .subscribe({
          next: () => {
            appt.date_time = newDate;
            this.snackBar.open('Appointment rescheduled', 'Close', {
              duration: 3000,
            });
          },
          error: () => {
            this.snackBar.open('Failed to reschedule', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }
}
