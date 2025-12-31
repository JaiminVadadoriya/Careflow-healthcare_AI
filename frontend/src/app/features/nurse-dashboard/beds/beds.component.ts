import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NurseService } from '../nurse.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignBedDialogComponent } from './assign-bed-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nurse-beds',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Bed Management</h2>
      </div>

      <div *ngIf="error" class="mb-4 text-red-600">{{ error }}</div>

      <div class="overflow-x-auto">
        <table mat-table [dataSource]="dataSource" class="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <ng-container matColumnDef="number">
            <th mat-header-cell *matHeaderCellDef>Bed #</th>
            <td mat-cell *matCellDef="let bed">{{ bed._id }}</td>
          </ng-container>

          <ng-container matColumnDef="ward">
            <th mat-header-cell *matHeaderCellDef>Ward</th>
            <td mat-cell *matCellDef="let bed">{{ bed.ward }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let bed">{{ bed.bed_type }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let bed">
              <span [ngClass]="{'text-green-600': !bed.is_occupied, 'text-red-600': bed.is_occupied}">
                {{ bed.is_occupied ? 'Occupied' : 'Available' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let bed">
              <button
                mat-raised-button
                color="primary"
                *ngIf="!bed.is_occupied"
                (click)="openAssignDialog(bed)"
                [disabled]="loadingMap[bed._id]"
              >
                <mat-spinner *ngIf="loadingMap[bed._id]" diameter="20"></mat-spinner>
                <span *ngIf="!loadingMap[bed._id]">Assign</span>
              </button>

              <button
                mat-raised-button
                color="warn"
                *ngIf="bed.is_occupied"
                (click)="confirmRelease(bed)"
                [disabled]="loadingMap[bed._id]"
              >
                <mat-spinner *ngIf="loadingMap[bed._id]" diameter="20"></mat-spinner>
                <span *ngIf="!loadingMap[bed._id]">Release</span>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `
})
export class BedsComponent implements OnInit {
  displayedColumns = ['number', 'ward', 'type', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  error = '';
  loadingMap: { [bedId: string]: boolean } = {};

  constructor(
    private nurseService: NurseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadBeds();
  }

  loadBeds() {
    this.loading = true;
    this.error = '';
    this.nurseService.getAllBeds().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load beds';
        this.loading = false;
      }
    });
  }

  openAssignDialog(bed: any) {
    const dialogRef = this.dialog.open(AssignBedDialogComponent, { width: '300px' });
    dialogRef.afterClosed().subscribe(patientId => {
      if (!patientId) return;
      this.loadingMap[bed._id] = true;
      this.nurseService.assignOrReleaseBed({ bedId: bed._id, patientId, action: 'assign' }).subscribe({
        next: () => {
          bed.is_occupied = true;
          this.snackBar.open('Bed assigned successfully', 'Close', { duration: 3000 });
          this.loadingMap[bed._id] = false;
        },
        error: () => {
          this.snackBar.open('Failed to assign bed', 'Close', { duration: 3000 });
          this.loadingMap[bed._id] = false;
        }
      });
    });
  }

  confirmRelease(bed: any) {
    if (confirm(`Are you sure you want to release bed ${bed._id}?`)) {
      this.loadingMap[bed._id] = true;
      this.nurseService.assignOrReleaseBed({ bedId: bed._id, action: 'release' }).subscribe({
        next: () => {
          bed.is_occupied = false;
          this.snackBar.open('Bed released successfully', 'Close', { duration: 3000 });
          this.loadingMap[bed._id] = false;
        },
        error: () => {
          this.snackBar.open('Failed to release bed', 'Close', { duration: 3000 });
          this.loadingMap[bed._id] = false;
        }
      });
    }
  }
}

