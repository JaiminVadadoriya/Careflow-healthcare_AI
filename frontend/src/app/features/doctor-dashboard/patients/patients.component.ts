import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientDetailComponent } from './patient-detail.component';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">My Patients</h2>
      </div>
      <mat-form-field  class="w-full md:w-1/3 mb-4">
        <mat-label>Search Patients</mat-label>
        <input matInput [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Search by name or ID">
      </mat-form-field>
      <div class="overflow-x-auto">
        <table mat-table [dataSource]="dataSource" class="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let patient">{{ patient.full_name }}</td>
          </ng-container>
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let patient">{{ patient._id }}</td>
          </ng-container>
          <ng-container matColumnDef="age">
            <th mat-header-cell *matHeaderCellDef>Age</th>
            <td mat-cell *matCellDef="let patient">{{ patient.dob }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let patient">
              <button mat-icon-button color="primary" (click)="openPatientDetail(patient)"><mat-icon>visibility</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'id', 'age', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  search = '';
  loading = false;
  error = '';

  constructor(private dialog: MatDialog, private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.error = '';
    this.doctorService.getAssignedPatients().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load patients';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
  }

  openPatientDetail(patient: any) {
    this.dialog.open(PatientDetailComponent, {
      data: patient,
      width: '600px'
    });
  }
} 