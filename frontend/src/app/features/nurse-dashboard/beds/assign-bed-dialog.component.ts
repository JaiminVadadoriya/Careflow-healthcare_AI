
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-bed-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Assign Bed</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="w-full">
        <mat-label>Patient ID</mat-label>
        <input matInput [(ngModel)]="patientId" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!patientId" (click)="assign()">Assign</button>
    </mat-dialog-actions>
  `
})
export class AssignBedDialogComponent {
  patientId = '';
  constructor(public dialogRef: MatDialogRef<AssignBedDialogComponent>) {}
  assign() {
    this.dialogRef.close(this.patientId.trim());
  }
}
