import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">My Appointments</h2>
      </div>
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <mat-form-field  class="w-full md:w-1/4">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilter()">
            <mat-option value="">All</mat-option>
            <mat-option value="scheduled">Scheduled</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field  class="w-full md:w-1/4">
          <mat-label>Date</mat-label>
          <input matInput [(ngModel)]="dateFilter" (ngModelChange)="applyFilter()" type="date">
        </mat-form-field>
      </div>
      <div class="overflow-x-auto">
        <table mat-table [dataSource]="dataSource" class="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <ng-container matColumnDef="patient">
            <th mat-header-cell *matHeaderCellDef>Patient</th>
            <td mat-cell *matCellDef="let appt">{{ appt.patient }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let appt">{{ appt.date }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let appt">{{ appt.status }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let appt">
              <button mat-button color="primary" (click)="markCompleted(appt)" *ngIf="appt.status === 'scheduled'">Mark Completed</button>
              <button mat-button color="warn" (click)="markCancelled(appt)" *ngIf="appt.status === 'scheduled'">Cancel</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['patient', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  statusFilter = '';
  dateFilter = '';
  loading = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.error = '';
    this.doctorService.getAppointments().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    let filtered = this.dataSource.data;
    if (this.statusFilter) {
      filtered = filtered.filter((a: any) => a.status === this.statusFilter);
    }
    if (this.dateFilter) {
      filtered = filtered.filter((a: any) => a.date === this.dateFilter);
    }
    this.dataSource.data = filtered;
  }

  markCompleted(appt: any) {
    const oldStatus = appt.status;
    appt.status = 'completed';
    this.doctorService.updateMedicalRecord(appt._id, { status: 'completed' }).subscribe({
      next: () => {},
      error: () => { appt.status = oldStatus; }
    });
  }

  markCancelled(appt: any) {
    const oldStatus = appt.status;
    appt.status = 'cancelled';
    this.doctorService.updateMedicalRecord(appt._id, { status: 'cancelled' }).subscribe({
      next: () => {},
      error: () => { appt.status = oldStatus; }
    });
  }
} 