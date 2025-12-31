import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReceptionistService } from '../receptionist.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-receptionist-checkin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatFormField,
    MatLabel,
    
  ],
  template: `
    <div class="p-6 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Patient Check-In</h2>
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
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let patient">{{ patient.current_status || 'Not Admitted' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let patient">
              <button mat-button color="primary" (click)="checkIn(patient)" *ngIf="patient.current_status !== 'admitted'">Check-In</button>
              <span *ngIf="patient.current_status === 'admitted'" class="text-green-600">Admitted</span>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class CheckinComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  search = '';
  loading = false;
  error = '';

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.error = '';
    this.receptionistService.getPatients().subscribe({
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

  checkIn(patient: any) {
    this.loading = true;
    this.receptionistService.checkInPatient(patient._id).subscribe({
      next: () => {
        patient.current_status = 'admitted';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
  }
} 